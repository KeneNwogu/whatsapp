import { Request, Response } from "express";
import { AuthService, socialLoginConfig } from "./auth.service";

import querystring from 'querystring';
import url from 'url';
import axios from 'axios';
import { UserService } from "../user/user.service";

export default class AuthController {
    static async getSocialLoginRedirectLink(req: Request, res: Response){
        const { provider } = req.body

        const socialProvider = socialLoginConfig[provider]
        if(!socialProvider) return res.status(404).end()

        
        const qs = querystring.stringify({
            'client_id': socialProvider.clientId,
            'redirect_uri': url.format({
                protocol: process.env.NODE_ENV === "production" ? "https" : "http",
                host: process.env.NODE_ENV === "production" ? req.hostname : `${req.hostname}:${process.env.PORT}`,
                pathname: `/api/v1/auth/social/${provider}/callback`
            }),
            'response_type': 'code',
            'scope': socialProvider.scopes.join(' ')
        })

        return res.status(200).json({ redirectUrl: `${socialProvider.authorizeUrl}?${qs}` }).end()
    }

    static async socialLoginCallbackHandler(req: Request, res: Response){
        const { provider } = req.params
        const providerData = socialLoginConfig[provider]
        if(!providerData) return res.status(404)

        const FRONTEND_URL = process.env.NODE_ENV === "development" ? process.env.FRONTEND_DEV_URL : process.env.FRONTEND_PROD_URL
        if ('error' in req.query){
            const qs = querystring.stringify({"error": "An unknown error occurred"})
            return res.redirect(`${FRONTEND_URL}?${qs}`)
        }

        if(!('code' in req.query)){
            const qs = querystring.stringify({"error": "Authorization code was missing in request"})
            return res.redirect(`${FRONTEND_URL}?${qs}`)
        }

        let response = await axios.post(providerData.tokenUrl, {
            'client_id': providerData.clientId,
            'client_secret': providerData.clientSecret,
            'code': req.query['code'],
            'grant_type': 'authorization_code',
            'redirect_uri': url.format({
                protocol: process.env.NODE_ENV === "production" ? "https" : "http",
                host: process.env.NODE_ENV === "production" ? req.hostname : `${req.hostname}:${process.env.PORT}`,
                pathname: `/api/v1/auth/social/${provider}/callback`
            }),
        }, {
            headers: {
                'Accept': 'application/json'
            }
        })

        if(response.status != 200){
            const qs = querystring.stringify({"error": "Authorization request failed"})
            return res.redirect(`${FRONTEND_URL}?${qs}`)
        }

        const oauth2_token = response.data.access_token
        if(!oauth2_token){
            const qs = querystring.stringify({"error": "No oauth token found"})
            return res.redirect(`${FRONTEND_URL}?${qs}`)
        }

        response = await axios.get(providerData.userInfo.url, {
            headers: {
                'Authorization': 'Bearer ' + oauth2_token,
                'Accept': 'application/json',
            }
        })
    
        if(response.status != 200) return res.redirect(`${FRONTEND_URL}`)

        const email = providerData.userInfo.email(response.data)
        const { firstName, lastName } = providerData.userInfo.profile(response.data)
        let user = await UserService.getUserByEmail(email)

        if(!user){
            // create user
            user = await AuthService.createUser(email, firstName, lastName)
        }

        const token = await AuthService.createAuthJWT(user?.id!, user?.email!)
        const qs = querystring.stringify({ "token": token, "userId": user?.id })
        return res.redirect(`${FRONTEND_URL}/login/success/?${qs}`)
    }

    static async getProfile(req: Request, res: Response){
        return res.status(200).json(req.user).end()
    }
}
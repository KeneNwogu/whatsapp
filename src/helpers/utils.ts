export function getCurrentDate(): Date {
    const now = new Date();
    const utcDate = new Date(Date.UTC(now.getUTCFullYear(),
      now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), 
      now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()));
    return utcDate
  }
  
  export function dateToUTCDate(date: Date): Date {
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(),
      date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), 
      date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()));
    return utcDate
  }
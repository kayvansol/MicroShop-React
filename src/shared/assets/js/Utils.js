
  export function nullsToZero(obj) {
    
    if (obj === null) return 0;

    if (Array.isArray(obj)) {
      return obj.map((item) => nullsToZero(item));
    }

    if (typeof obj === "object") {
      const newObj = {};
      for (const key in obj) {
        newObj[key] = nullsToZero(obj[key]);
      }
      return newObj;
    }

    return obj;
  }

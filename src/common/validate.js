export function Emailvalidate(email) {
    const regemail = /^\w+([/.-]?\w+)*@\w+([/.-]?\w+)*(\.\w{2,3})+$/;
    if (regemail.test(email)) {
        return 1;
    }
    else {
        return 0;
    }
}
export function Urlvalidate(url) {
    const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
    if (regex.test(url)) {
        return 1;
    }
    else {
        return 0;
    }
}

export function Validpassword(password) {
    const pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#/$%/^&/*])(?=.{8,})");
    const passwordvalid = pattern.test(password)
    return passwordvalid
}

export function Facebookvalidate(facebook_link) {
    const facebook_pattern = /^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/;
    const isvalidFacebooklink = facebook_pattern.test(facebook_link);
    return isvalidFacebooklink;
}

export function Twittervalidate(twitter_link) {
    const twitter_pattern = /^(https?:\/\/)?((w{3}\.)?)twitter.com\/.*/;
    const isvalidTwitterlink = twitter_pattern.test(twitter_link);
    return isvalidTwitterlink;
}

export function Googleplusvalidate(googleplus_link) {
    const googleplus_pattern = /plus\.google\.com\/.?\/?.?\/?([0-9]*)/;
    const isvalidGooglepluslink = googleplus_pattern.test(googleplus_link);
    return isvalidGooglepluslink;
}

export function Phonenumber(number) {
    const phoneno = /^\d{10}$/;
    if (phoneno.test(number)) {
        return 1;
    } else {
        return 0;
    }
}
export function NumberOnly(num) {
    const number = /^\d+$/;
    if (number.test(num)) {
        return 1
    } else {
        return 0
    }
}
export function Imagevalidation(logo) {
    const fileInfo = logo;
    const fileType = fileInfo.type;
    const type = fileType.split('/');
    if (type[1] === 'jpg' || type[1] === 'jpeg' || type[1] === 'png') {
        return 1;
    } else {
        return 0;
    }
}

export function Filevalidation(file) {
    const fileInfo = file;
    const fileType = fileInfo.type;
    const type = fileType.split('/');
    if (type[1] === 'pdf' || type[1] === 'doc' || type[1] === 'docx') {
        return 1;
    } else {
        return 0;
    }
}

export function FileAndImagevalidation(file) {
    const fileInfo = file;
    const fileType = fileInfo.type;
    const type = fileType.split('/');
    if (type[1] === 'pdf' || type[1] === 'doc' || type[1] === 'docx' || type[1] === 'jpg' || type[1] === 'jpeg' || type[1] === 'png' || type[1] === 'csv' || type[1] === 'msword') {
        return {
            allow: true,
            type: type[1]
        };
    } else {
        return 0;
    }
}

export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export function GetAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function Zip(zip) {
    const zippattern = /^\d{5}[-\s]?(?:\d{4})?$/;
    const patternnumner = /(^\d{6}$)|(^\d{6}-\d{4}$)/;
    if ((zippattern.test(zip)) || (patternnumner.test(zip))) {
        return 1;
    } else {
        return 0;
    }
}
export function Hostvalid(host) {
    const pattern = /^\w+\.\w+\.[a-zA-z]{1,3}$/    //xxx.domain.in/com/...
    const hostnamevalid = pattern.test(host)
    return hostnamevalid
}
export function Portvalid(port) {  //takes port number with in the range of 1-65535
    const patt = /^((((([1-9])|([1-9][0-9])|([1-9][0-9][0-9])|([1-9][0-9][0-9][0-9])|([1-6][0-5][0-5][0-3][0-5])))))$/   //range from (1-65535)
    const postnamevalid = patt.test(port)
    return postnamevalid
}
export function Capitalize(text) {
    const capitalizedText = (text && text.length > 0) ? (text.charAt(0).toUpperCase() + text.slice(1)) : text;
    return capitalizedText;
}
export function CapitalizeFirstLetter(text) {
    const capitalizedText = (text && text.length > 0) ? (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()) : text;
    return capitalizedText;
}

export function Currency(amount) {
    if (amount) {
        amount = amount.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
        if (amount.indexOf('.') === -1)
            return amount + '.00';
        var decimals = amount.split('.')[1];
        return decimals.length < 2 ? amount + '0' : amount;
    }
};

export function TimeFormat(time) {
    if (time && time.length < 10) {
        const timeValue = time.split(' ');
        if (timeValue.length == 2) {
            return time
        }
        if (timeValue.length == 1) {
            const timeString12hr = new Date('1970-01-01T' + time + 'Z')
                .toLocaleTimeString('en-US',
                    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
                );
            return timeString12hr
        }
    } else {
        return ''
    }
}

export function TimeFormat24(time) {
    if (time) {
        const timeValue = time.split(' ');
        if (timeValue.length == 2) {
            var [timeval, modifier] = time.split(' ');
            var [hours, minutes] = timeval.split(':');
            if (hours === '12') {
                hours = '00';
            }
            if (modifier == 'PM' || modifier == 'pm') {
                hours = parseInt(hours, 10) + 12;
            }
            if ((parseInt(hours) < 10)) hours = '0' + hours;
            return `${hours.toString()}:${minutes.toString()}`;
        }
        if (timeValue.length == 1) {
            return time
        }
    } else {
        return ''
    }
}

export function Textareavalidation(text) {
    var res = {}
    if (text.length <= 0) {
        res.notextErr = true;
        res.value = text
        res.textlimitErr = false;

    }
    else if (text.length < 256 && text.length >= 0) {
        res.notextErr = false;
        res.textlimitErr = false;
        res.value = text
    }
    else {
        res.notextErr = false;
        res.textlimitErr = true;
        res.value = text
    }
    return res
}
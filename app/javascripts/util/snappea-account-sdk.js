/*global $, assure*/
(function (global) {

    var Deferred = window.Q.defer;
    var ajax = window.$.ajax;

    if ($.ajaxSetup) {
        $.ajaxSetup({
            xhrFields : {
                withCredentials : true
            }
        });
    }

    var extend = function (dist, source) {
        if (!source) {
            return dist;
        }

        var prop;
        for (prop in source) {
            if (source.hasOwnProperty(prop)) {
                dist[prop] = source[prop];
            }
        }

        return dist;
    };

    var HOST = 'https://account.wandoujia.com',
        HOST_HTTP = 'http://www.wandoujia.com/api/account',
        API_VERSION_4 = '/v4/api',
        USE_HTTP_API = navigator.userAgent.toLowerCase().indexOf('msie') > -1,
        PREFIX = (USE_HTTP_API ? HOST_HTTP : HOST) + API_VERSION_4;

    var CONFIG = {
        login : PREFIX + '/login',
        logout : PREFIX + '/logout',
        captcha : PREFIX + '/seccode',
        reg : PREFIX + '/register',
        checkUsername : PREFIX + '/isUsernameExisted',
        checkUserLogin : PREFIX + '/profile',
        findPwd : PREFIX + '/findpassword',
        checkCode : PREFIX + '/checkcode',
        resetPwd : PREFIX + '/resetpassword',
        modifyPwd : PREFIX + '/profile/password',
        checkPasscode : PREFIX + '/checkpasscode',
        modifyPwdByCode : PREFIX + '/modifypassword',
        completeProfile : PREFIX + '/completeProfile',
        unbindThirdParty : PREFIX + '/social/unbind',
        avatar : PREFIX + '/avatar'
    };

    var CONFIG_WEB = {
        loginWithThirdParty : HOST + '/web/oauth2/{1}/login'
    };

    var USER_INFO;
    var IS_LOGINED = false;

    var Account = {};

    Account.CAPTCHA = CONFIG.captcha;

    Account.loginAsync = function (data, options) {
        var deferred = new Deferred();

        data = data || {};
        options = options || {};

        if (!data.username || !data.password) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.login,
                data : extend({
                    username : data.username,
                    password : data.password,
                    seccode : data.seccode || ''
                }, options),
                success : function (resp) {
                    if (resp.error === 0) {
                        IS_LOGINED = true;
                        USER_INFO = resp.member;
                        deferred.resolve(resp.member);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.isLogined = function () {
        return IS_LOGINED;
    };

    Account.getUserInfo = function () {
        return USER_INFO;
    };

    Account.logoutAsync = function (options) {
        var deferred = new Deferred();

        options = options || {};

        ajax({
            type : 'POST',
            dataType : 'json',
            url : CONFIG.logout,
            data : options,
            success : function (resp) {
                if (resp.error === 0) {
                    IS_LOGINED = false;
                    USER_INFO = undefined;
                    deferred.resolve(resp);
                } else {
                    deferred.reject(resp);
                }
            },
            error : function (xhr) {
                if (xhr.readyState === 4) {
                    deferred.reject(xhr.responseJSON);
                }

                deferred.reject({
                    error : -1,
                    msg : '请求失败，请检查网络连接状况。'
                });
            }
        });

        return deferred.promise;
    };

    Account.regAsync = function (data, options) {
        var deferred = new Deferred();

        data = data || {};
        options = options || {};

        if (!data.username || !data.password) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.reg,
                data : extend({
                    username : data.username,
                    password : data.password,
                    nick : data.nickname || '',
                    seccode : data.seccode || ''
                }, options),
                success : function (resp) {
                    if (resp.error === 0) {
                        IS_LOGINED = true;
                        USER_INFO = resp.member;
                        deferred.resolve(resp.member);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.checkUsernameAsync = function (username, options) {
        var deferred = new Deferred();

        options = options || {};

        if (username === undefined) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.checkUsername,
                data : extend({
                    username : username
                }, options),
                success : function (resp) {
                    deferred.resolve(resp);
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.checkUserLoginAsync = function (options) {
        var deferred = new Deferred();

        options = options || {};

        var jsonp = !!options.jsonp;
        delete options.jsonp;

        ajax({
            type : 'GET',
            dataType : jsonp ? 'jsonp' : 'json',
            url : CONFIG.checkUserLogin,
            data : options,
            crossDomain: jsonp ? true : undefined,
            success : function (resp) {
                if (resp.error === 0) {
                    IS_LOGINED = true;
                    USER_INFO = resp.member;
                    deferred.resolve(true);
                } else {
                    IS_LOGINED = false;
                    USER_INFO = undefined;
                    deferred.reject(false);
                }
            },
            error : function () {
                deferred.reject(false);
            }
        });

        return deferred.promise;
    };

    Account.findPwdAsync = function (username, options) {
        var deferred = new Deferred();

        options = options || {};

        if (username === undefined) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.findPwd,
                data : extend({
                    username : username
                }, options),
                success : function (resp) {
                    if (resp.error === 0) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.checkCodeAsync = function (data, options) {
        var deferred = new Deferred();

        data = data || {};
        options = options || {};

        if (data.username === undefined ||
                data.passcode === undefined) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.checkCode,
                data : extend({
                    username : data.username,
                    passcode : data.passcode
                }, options),
                success : function (resp) {
                    if (resp.error === 0) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.resetPwdAsync = function (data, options) {
        var deferred = new Deferred();

        data = data || {};
        options = options || {};

        if (data.username === undefined ||
                data.passcode === undefined ||
                data.password === undefined) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.resetPwd,
                data : extend({
                    username : data.username,
                    passcode : data.passcode,
                    password : data.password,
                    repeatedpassword : data.password
                }, options),
                success : function (resp) {
                    if (resp.error === 0) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.modifyPwdAsync = function (data, options) {
        var deferred = new Deferred();

        data = data || {};
        options = options || {};

        if (data.password === undefined ||
                data.newpassword === undefined) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.modifyPwd,
                data : extend({
                    oldpassword : data.password,
                    newpassword : data.newpassword
                }, options),
                success : function (resp) {
                    if (resp.error === 0) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.checkPasscodeAsync = function (data, options) {
        var deferred = new Deferred();

        data = data || {};
        options = options || {};

        if (data.passcode === undefined) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.checkPasscode,
                data : extend({
                    passcode : data.passcode
                }, options),
                success : function (resp) {
                    if (resp.error === 0) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.modifyPwdByCodeAsync = function (data, options) {
        var deferred = new Deferred();

        data = data || {};
        options = options || {};

        if (data.passcode === undefined ||
                data.password === undefined) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.modifyPwdByCode,
                data : extend({
                    passcode : data.passcode,
                    password : data.password
                }, options),
                success : function (resp) {
                    if (resp.error === 0) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.updateProfileAsync = function (data, options) {
        var deferred = new Deferred();

        data = data || {};
        options = options || {};

        if (data.nickname === undefined) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.completeProfile,
                data : extend({
                    nick : data.nickname
                }, options),
                success : function (resp) {
                    if (resp.error === 0) {
                        USER_INFO = resp.member;
                        deferred.resolve(resp.member);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    /* `data.file` should be `File` */
    Account.uploadAvatarAsync = function (data, options) {
        var deferred = new Deferred();

        data = data || {};
        options = options || {};

        var formData, f;

        if (data.file === undefined) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            formData = new global.FormData();
            formData.append('file', data.file);

            for (f in options) {
                if (options.hasOwnProperty(f)) {
                    formData.append(f, options[f]);
                }
            }

            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.avatar,
                data : formData,
                processData : false,
                contentType : false,
                success : function (resp) {
                    if (resp.error === 0) {
                        USER_INFO = resp.member;
                        deferred.resolve(resp.member.avatar);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.unbindThirdPartyAsync = function (data, options) {
        var deferred = new Deferred();

        data = data || {};
        options = options || {};

        var platforms = {
            weibo : '1',
            sina : '1',
            qq : '2',
            renren : '3'
        };

        if (data.platform === undefined ||
                platforms[data.platform] === undefined) {
            deferred.reject({
                error : -2,
                msg : '参数不全'
            });
        } else {
            ajax({
                type : 'POST',
                dataType : 'json',
                url : CONFIG.unbindThirdParty,
                data : extend({
                    platid : platforms[data.platform]
                }, options),
                success : function (resp) {
                    if (resp.error === 0) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp);
                    }
                },
                error : function (xhr) {
                    if (xhr.readyState === 4) {
                        deferred.reject(xhr.responseJSON);
                    }

                    deferred.reject({
                        error : -1,
                        msg : '请求失败，请检查网络连接状况。'
                    });
                }
            });
        }

        return deferred.promise;
    };

    Account.isEmail = function (input) {
        var EMAIL_PATTREN = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        return EMAIL_PATTREN.test(input);
    };

    Account.isPhoneNumber = function (input) {
        var PHONE_PATTERN = /^(1(([3548][\d])))\d{8}$/;
        return PHONE_PATTERN.test(input);
    };

    /* `platform` could be one of `weibo`, `qq`, `renren` */
    Account.loginWithThirdParty = function (options) {
        options = options || {};

        options.callback = options.callback || 'http://www.wandoujia.com/';

        var platforms = {
            weibo : 'sina',
            sina : 'sina',
            renren : 'renren',
            qq : 'qq'
        };

        var platform = platforms[options.platform];
        delete options.platform;

        var onclose = options.onclose || function () { return; };
        delete options.onclose;

        var datas = [];
        var d;
        for (d in options) {
            if (options.hasOwnProperty(d)) {
                datas.push(d + '=' + global.encodeURIComponent(options[d]));
            }
        }

        var targetURL = CONFIG_WEB.loginWithThirdParty.replace('{1}', platform);

        if (datas.length > 0) {
            targetURL = targetURL + '?' + datas.join('&');
        }

        if (options.popup) {
            var win = window.open(targetURL, 'loginWithThirdParty', 'width=650, height=480');

            var winInterval = setInterval(function () {
                if (win.closed) {
                    clearInterval(winInterval);
                    onclose.call(this);
                }
            }, 200);
        } else {
            global.location.href = targetURL;
        }
    };

    var SnapPea = global.SnapPea || {};
    SnapPea.Account = Account;
    global.SnapPea = SnapPea;
}(this));

import appConfig from '../models/Auth/appconfig.model.js'
export const generate = (type) => {
    return new Promise((resolve, reject) => {
        appConfig.findOne({}).sort({ createdAt: -1 }).then((found) => {
            if (found) {
                if (type.toString() === 'user') {
                    let userSr = found.userSr
                    appConfig.updateOne({ _id: found._id }, { $inc: { userSr: 1 } }).then((update) => {
                        resolve(userSr)
                    }).catch((error) => {
                        reject("App Config Not Update.");
                    })
                } else if (type.toString() == 'admin') {
                    let adminSr = found.adminSr
                    appConfig.updateOne({ _id: found._id }, { $inc: { adminSr: 1 } }).then((update) => {
                        resolve(adminSr)
                    }).catch((error) => {
                        reject("App Config Not Update.");
                    })

                }
                else {
                    reject("Invalid Type.");
                }
            } else {
                let ins = new appConfig({})
                ins.save()
                reject("App Config Not Found.");
            }
        }).catch((error) => {
            reject("App Config Not Found.");
        })
    });
};

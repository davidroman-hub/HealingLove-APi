const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
// sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
    // console.log('REQ BODY ON SIGNUP', req.body);
    const { name, email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }
    });

    let newUser = new User({ name, email, password });

    newUser.save((err, success) => {
        if (err) {
            console.log('SIGNUP ERROR', err);
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Signup success! Please signin'
        });
    });
};

// exports.signup = (req, res) => {
//     const { name, email, password } = req.body;

//     User.findOne({ email }).exec((err, user) => {
//         if (user) {
//             return res.status(400).json({
//                 error: 'Ya existe cuenta con ese E-mail'
//             });
//         }

//         const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });

//         const emailData = {
//             from: process.env.EMAIL_FROM,
//             to: email,
//             subject: `Link de activacion de cuenta`,
//             html: `
//                 <h1>Da click en el siguiente Link para activar tu cuenta! y sigues las instrucciones</h1>
//                 <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
//                 <hr />
//                 <p>Este E-mail contiene información sensible</p>
//                 <p>${process.env.CLIENT_URL}</p>
//             `
//         };

//         sgMail
//             .send(emailData)
//             .then(sent => {
//                 // console.log('SIGNUP EMAIL SENT', sent)
//                 return res.json({
//                     message: `E-mail ha sido enviado a:${email}. Sigue las instrucciones para activar tu cuenta!, REVISA TU SPAM`
//                 });
//             })
//             .catch(err => {
//                 // console.log('SIGNUP EMAIL SENT ERROR', err)
//                 return res.json({
//                     message: err.message
//                 });
//             });
//     });
// };

// exports.signup = (req, res) => {
//     const { name, email, password } = req.body;

//     User.findOne({ email }).exec((err, user) => {
//         if (user) {
//             return res.status(400).json({
//                 error: 'Ya existe cuenta con ese E-mail'
//             });
//         }

//         const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });

//         const emailData = {
//             from: process.env.EMAIL_FROM,
//             to: email,
//             subject: `Link de activacion de cuenta`,
//             html: `            
//         <body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
//         <!--<![endif]-->
//             <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>
//             <div role="banner">
//                 <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
//                 <div style="border-collapse: collapse;display: table;width: 100%;">
//                 <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
//                     <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #999;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;">
                    
//                     </div>
//                 <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
//                     <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #999;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;">
                    
//                     </div>
//                 <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
//                 </div>
//                 </div>
//                 <div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container">
//                 <!--[if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
//                 <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #41637e;font-family: Avenir,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center">
//                     <div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 338px;" src="https://res.cloudinary.com/dm8dxwvix/image/upload/v1596535714/Healing%20love/Healing_love-logo_web_color_Mesa_de_trabajo_1_1_ku0cxv.png" alt="" width="338" /></div>
//                 </div>
//                 <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
//                 </div>
//             </div>
//             <div>
//             <div style="background-color: #f6ebd9;background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/4F/40E/057/202304/csfinal/CMWelcome.png) #f6ebd9;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/4F/40E/057/202304/csfinal/CMWelcome.png);background-repeat: repeat;background-size: auto auto;">
//                 <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
//                 <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
//                 <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/4F/40E/057/202304/csfinal/CMWelcome.png) #f6ebd9;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/4F/40E/057/202304/csfinal/CMWelcome.png);background-repeat: repeat;background-size: auto auto;background-color: #f6ebd9;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
//                     <div class="column" style="text-align: left;color: #565656;font-size: 17px;line-height: 26px;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;">
                    
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;line-height: 68px;font-size: 1px;">&nbsp;</div>
//             </div>
                    
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
//                 <h1 style="Margin-top: 0;Margin-bottom: 20px;font-style: normal;font-weight: normal;color: #fff;font-size: 36px;line-height: 43px;text-align: center;"><em><span style="color:#000000">Bienvenid@ a la Familia</span></em></h1>
//             </div>
//             </div>
                    
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;line-height: 47px;font-size: 1px;">&nbsp;</div>
//             </div>
                    
//                     </div>
//                 <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
//                 </div>
//                 </div>
//             </div>
        
//             <div style="background-color: #f6ebd9;">
//                 <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
//                 <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
//                 <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f6ebd9;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
//                     <div class="column" style="text-align: left;color: #565656;font-size: 17px;line-height: 26px;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;">
                    
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;line-height: 6px;font-size: 1px;">&nbsp;</div>
//             </div>
                    
//                     </div>
//                 <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
//                 </div>
//                 </div>
//             </div>
        
//             <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>
        
//             <div class="layout one-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
//                 <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
//                 <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;"><td style="width: 600px" class="w560"><![endif]-->
//                 <div class="column" style="text-align: left;color: #565656;font-size: 17px;line-height: 26px;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;">
                
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;line-height: 21px;font-size: 1px;">&nbsp;</div>
//             </div>
                
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
//                 <h2 style="Margin-top: 0;Margin-bottom: 16px;font-style: normal;font-weight: normal;color: #89c0ae;font-size: 24px;line-height: 32px;text-align: center;"><strong>Activa tu cuenta en el Siguiente Link</strong></h2>
//             </div>
//             </div>
                
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
//             </div>
                
//                 <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
//                 <img style="border: 0;display: block;height: auto;width: 100%;max-width: 487px;" alt="" width="487" src="https://res.cloudinary.com/dm8dxwvix/image/upload/v1596538045/Healing%20love/welcome_o7jzli.jpg" />
//                 </div>
            
//                     <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
//             <div style="mso-line-height-rule: exactly;line-height: 7px;font-size: 1px;">&nbsp;</div>
//             </div>
                
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
//                 <p style="Margin-top: 0;Margin-bottom: 20px;text-align: center;">&quot;${process.env.CLIENT_URL}/auth/activate/${token}&quot;</p>
//             </div>
//             </div>
                
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
//             </div>
                
//                 </div>
//                 <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
//                 </div>
//             </div>
        
//             <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>
        
//             <div class="layout three-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
//                 <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
//                 <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;"><td style="width: 200px" valign="top" class="w160"><![endif]-->
//                 <div class="column" style="text-align: left;color: #565656;font-size: 17px;line-height: 26px;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);Float: left;">
                
//                 <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
//                 <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 480px;" alt="" width="200" src="https://res.cloudinary.com/dm8dxwvix/image/upload/v1596538186/Healing%20love/5337ab0e693d752d240c10c858c867ba_clgt0v.jpg" />
//                 </div>
            
//                 </div>
//                 <!--[if (mso)|(IE)]></td><td style="width: 200px" valign="top" class="w160"><![endif]-->
//                 <div class="column" style="text-align: left;color: #565656;font-size: 17px;line-height: 26px;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);Float: left;">
                
//                 <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
//                 <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top" style="border: 0;display: block;height: auto;width: 100%;max-width: 480px;" alt="" width="200" src="https://res.cloudinary.com/dm8dxwvix/image/upload/v1596538186/Healing%20love/cc5514af4f654c3eb59ca75a12cc958a_un3ffq.jpg" />
//                 </div>
            
//                     <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
//             <div style="mso-line-height-rule: exactly;line-height: 6px;font-size: 1px;">&nbsp;</div>
//             </div>
                
//                 </div>
//                 <!--[if (mso)|(IE)]></td><td style="width: 200px" valign="top" class="w160"><![endif]-->
//                 <div class="column" style="text-align: left;color: #565656;font-size: 17px;line-height: 26px;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);Float: left;">
                
//                 <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
//                 <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 480px;" alt="" width="200" src="https://res.cloudinary.com/dm8dxwvix/image/upload/v1596538186/Healing%20love/4db0e614ec3f74e8eb79e303afcb2e0b_ahcpef.jpg" />
//                 </div>
            
//                 </div>
//                 <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
//                 </div>
//             </div>
        
//             <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>
        
//             <div class="layout one-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
//                 <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
//                 <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;"><td style="width: 600px" class="w560"><![endif]-->
//                 <div class="column" style="text-align: left;color: #565656;font-size: 17px;line-height: 26px;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;">
                
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;line-height: 24px;font-size: 1px;">&nbsp;</div>
//             </div>
                
//                     <div style="Margin-left: 20px;Margin-right: 20px;">
//             <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
//             </div>
                
//                 </div>
//                 <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
//                 </div>
//             </div>
        
//             <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>
        
            
//             <div role="contentinfo">
//                 <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
//                 <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
//                 <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
//                     <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
//                     <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
//                         <table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links><tbody><tr role="navigation">
//                         <td style="padding: 0;width: 26px;" emb-web-links><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #999;" href="https://www.instagram.com/healinglove.mx"><img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" width="26" height="26" alt="Instagram" /></a></td>
//                         </tr></tbody></table>
//                         <div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">
//                         <div>Healing Love Studio<br />
//         &nbsp;</div>
//                         </div>
//                         <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">
//                         <div>Este E-mail Es solo para la activaci&#243;n de la cuenta.&nbsp;</div>
//                         </div>
//                         <!--[if mso]>&nbsp;<![endif]-->
//                     </div>
//                     </div>
//                 <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
//                     <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
//                     <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                        
//                     </div>
//                     </div>
//                 <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
//                 </div>
//                 </div>
//                 <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
//                 <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
//                 <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
//                     <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Lora,Palatino,Book Antiqua,Georgia,serif;">
//                     <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                        
//                     </div>
//                     </div>
//                 <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
//                 </div>
//                 </div>
//             </div>
//             <div style="line-height:40px;font-size:40px;">&nbsp;</div>
//             </div></td></tr></tbody></table>
        
//         </body>
//             `
//         };

//         sgMail
//             .send(emailData)
//             .then(sent => {
//                 // console.log('SIGNUP EMAIL SENT', sent)
//                 return res.json({
//                     message: `E-mail ha sido enviado a:${email}. Sigue las instrucciones para activar tu cuenta!, REVISA TU SPAM`
//                 });
//             })
//             .catch(err => {
//                 // console.log('SIGNUP EMAIL SENT ERROR', err)
//                 return res.json({
//                     message: err.message
//                 });
//             });
//     });
// };
exports.accountActivation = (req, res) => {
    const { token } = req.body;

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if (err) {
                console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
                return res.status(401).json({
                    error: 'Expired link. Signup again'
                });
            }

            const { name, email, password } = jwt.decode(token);

            const user = new User({ name, email, password });

            user.save((err, user) => {
                if (err) {
                    console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
                    return res.status(401).json({
                        error: 'ERROR EN EL REGISTRO. Registrate otra vez'
                    });
                }
                return res.json({
                    message: 'Registro completado! Porfavor inicia sesión'
                });
            });
        });
    } else {
        return res.json({
            message: 'Algo paso mal intenta de nuevo! '
        });
    }
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    // check if user exist
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Usuario con ese email no existe porfavor REGISTRATE'
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'El E-mail y la contraseña no coinciden!'
            });
        }
        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role }
        });
    });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET // req.user._id
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};


exports.adminMiddleware = (req, res, next) => {
    User.findById({ _id: req.user._id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== 1) {
            return res.status(400).json({
                error: 'Admin resource. Access denied.'
            });
        }

        req.profile = user;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (user.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Usuario con ese E-mail no existe!'
            });
        }

        const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_RESET_PASSWORD, {
            expiresIn: '10m'
        });

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Link Para Recuperar contraseña`,
            html: `
                <h1>PorFavor sigue las instrucciones para reestablecer tu cuenta!</h1>
                <h3>Dando click en el link de abajo</h3>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>Este E-mail contiene información sensible</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                console.log('RESET PASSWORD LINK ERROR', err);
                return res.status(400).json({
                    error: 'Database connection error on user password forgot request'
                });
            } else {
                sgMail
                    .send(emailData)
                    .then(sent => {
                        // console.log('SIGNUP EMAIL SENT', sent)
                        return res.json({
                            message: `E-mail fue enviado a: ${email}. Sigue las instrucciones para activar tu cuenta`
                        });
                    })
                    .catch(err => {
                        // console.log('SIGNUP EMAIL SENT ERROR', err)
                        return res.json({
                            message: err.message
                        });
                    });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if (err) {
                return res.status(400).json({
                    error: 'Expired link. Try again'
                });
            }

            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'Something went wrong. Try later'
                    });
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Error al resetear la contraseña nueva del usuario'
                        });
                    }
                    res.json({
                        message: `Perfecto! ahora puedes acceder con tu nueva contraseña!`
                    });
                });
            });
        });
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
    const { idToken } = req.body;

    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
        // console.log('GOOGLE LOGIN RESPONSE',response)
        const { email_verified, name, email } = response.payload;
        if (email_verified) {
            User.findOne({ email }).exec((err, user) => {
                if (user) {
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                    const { _id, email, name, role } = user;
                    return res.json({
                        token,
                        user: { _id, email, name, role }
                    });
                } else {
                    let password = email + process.env.JWT_SECRET;
                    user = new User({ name, email, password });
                    user.save((err, data) => {
                        if (err) {
                            console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                            return res.status(400).json({
                                error: 'User signup failed with google'
                            });
                        }
                        const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                        const { _id, email, name, role } = data;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    });
                }
            });
        } else {
            return res.status(400).json({
                error: 'Google login failed. Try again'
            });
        }
    });
};

exports.facebookLogin = (req, res) => {
    console.log('FACEBOOK LOGIN REQ BODY', req.body);
    const { userID, accessToken } = req.body;

    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

    return (
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            // .then(response => console.log(response))
            .then(response => {
                const { email, name } = response;
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                        const { _id, email, name, role } = user;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        let password = email + process.env.JWT_SECRET;
                        user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with facebook'
                                });
                            }
                            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                });
            })
            .catch(error => {
                res.json({
                    error: 'Facebook login failed. Try later'
                });
            })
    );
};

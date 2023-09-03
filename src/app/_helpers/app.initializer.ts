import { finalize } from 'rxjs';

import { AccountService } from '@app/_services';
import { environment } from '@environments/environment';

export function appInitializer(accountService: AccountService) {
    return () => new Promise(resolve => {
        window.fbAsyncInit = function () {
            FB.init({
                appId: environment.facebookAppId,
                cookie: true,
                xfbml: true,
                version: 'v17.0'
            });
            FB.getLoginStatus(({ authResponse }) => {
                if (authResponse) {
                    accountService.loginApi(authResponse.accessToken)
                        .pipe(finalize(() => resolve(null)))
                        .subscribe();
                } else {
                    resolve(null);
                }
            });
        };

        // load facebook sdk script
        (function (d, s, id) {
            var js: any;
            var fjs: any = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); 
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
}
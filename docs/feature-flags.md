# Feature Flags

We often want to deploy a feature "dark" and expose only a few accounts or users to it. Here's a way to do that using our API's account and user `options` fields.

**Caveat**: Both `account.options.ui` and `users.options.ui` are settable from the public API so theoretically any user could toggle a feature. They'd have to guess the flag name though.

This method is built on top of our [access control strategy](access-control.md) which you may like to read first.

## Useful Conditions

There are 2 conditions available for testing feature flags:

 - `src/conditions/account.js`: `isAccountUiOptionSet`
 - `src/conditions/user.js`: `isUserUiOptionSet`

## Hide A Navigation Item / Route Behind a Flag
These steps let you deploy a whole route visible only to those account you choose.

1. When adding your route to `routes`, use either the`isAccountUiOptionSet` or `isUserUiOptionSet` condition to tie the item to an account UI option:

    ```js
    const routes = [
      {
        path: '/my-new-route',
        condition: isAccountUiOptionSet('my-new-route', false),
        ...
      },
      ...
    ]
    ```

    Both conditions accept 2 arguments:
     - UI option name
     - default value if the option is not set

    You can use the default value to control whether your feature is on or off by default.

    (Remember to also add your route to `navItems` or `accountNavItems` to connect it to a menu 😉 )

    You can now deploy your feature but it'll be inaccessible, even to people who sneakily navigate directly to your route.

## Give Access To Your Feature

After you hide your feature behind UI option, you can now set that option on each account or user to give them access.

For an account:
```sh
echo '{"options": {"ui": {"my-new-route": true}}}' | http put app.tst.sparkpost:8888/api/v1/account/control x-msys-tenant:uat x-msys-customer:<CID>
```

For a user:

```sh
echo '{"options": {"ui": {"my-new-route": true}}}' | http put app.tst.sparkpost:8888/api/v1/user/{username}/control
x-msys-tenant:uat x-msys-customer:<CID>
```

Your navigation item will now be visible to those accounts you have blessed.

## Revoke Access To Your Feature

For an account:
```sh
echo '{"options": {"ui": {"my-new-route": false}}}' | http put app.tst.sparkpost:8888/api/v1/account/control x-msys-tenant:uat x-msys-customer:<CID>
```

For a user:
```sh
echo '{"options": {"ui": {"my-new-route": false}}}' | http put app.tst.sparkpost:8888/api/v1/user/{username}/control x-msys-tenant:uat x-msys-customer:<CID>
```

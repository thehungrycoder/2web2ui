# Account-level Feature Flags

We often want to deploy a feature "dark" and expose only a few accounts to it. Here's a way to do that using the `account.options.ui` object.

**Caveat**: `account.options.ui` is setting from the public `/account` endpoint so theoretically any user could toggle a feature. They'd have to guess the flag name though.

This method is built on top of our [access control strategy](access-control.md) which you may like to read first.

## Show/Hide A Navigation Item / Route
These steps let you deploy a whole route visible only to those account you choose.

1. When adding your route to `routes`, use the `hasUiOption` condition to tie the item to an account UI option:

    ```js
    const routes = [
      {
        path: '/my-new-route',
        condition: hasUiOption('my-new-route'),
        ...
      },
      ...
    ]
    ```

    (Remember to also add your route to `navItems` or `accountNavItems` to connect it to a menu 😉 )

    You can now deploy your feature but it'll be inaccessible, even to people who sneakily navigate directly to your route.

1. Set your new account UI option on each account you want to have access:

    ```sh
    echo '{"options": {"ui": {"my-new-route": true}}}' | http put app.tst.sparkpost:8888/api/v1/account/control x-msys-tenant:uat x-msys-customer:<CID>
    ```

    Your navigation item will now be visible to those accounts you have blessed.

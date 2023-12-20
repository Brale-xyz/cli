# Brale CLI

CLI for use against Brale's API.

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g brale
$ brale COMMAND
running command...
$ brale (--version)
brale/0.0.0 darwin-arm64 node-v20.5.0
$ brale --help [COMMAND]
USAGE
  $ brale COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`brale addresses`](#brale-addresses)
- [`brale base`](#brale-base)
- [`brale financial-institutions`](#brale-financial-institutions)
- [`brale help [COMMANDS]`](#brale-help-commands)
- [`brale orders get ID`](#brale-orders-get-id)
- [`brale plugins`](#brale-plugins)
- [`brale plugins:install PLUGIN...`](#brale-pluginsinstall-plugin)
- [`brale plugins:inspect PLUGIN...`](#brale-pluginsinspect-plugin)
- [`brale plugins:install PLUGIN...`](#brale-pluginsinstall-plugin-1)
- [`brale plugins:link PLUGIN`](#brale-pluginslink-plugin)
- [`brale plugins:uninstall PLUGIN...`](#brale-pluginsuninstall-plugin)
- [`brale plugins reset`](#brale-plugins-reset)
- [`brale plugins:uninstall PLUGIN...`](#brale-pluginsuninstall-plugin-1)
- [`brale plugins:uninstall PLUGIN...`](#brale-pluginsuninstall-plugin-2)
- [`brale plugins update`](#brale-plugins-update)
- [`brale tokens`](#brale-tokens)
- [`brale tokens deployments TICKER`](#brale-tokens-deployments-ticker)
- [`brale tokens mint TICKER`](#brale-tokens-mint-ticker)
- [`brale tokens redeem TICKER`](#brale-tokens-redeem-ticker)

## `brale addresses`

List addresses

```
USAGE
  $ brale addresses [--json] [-r] [-t <value>]

FLAGS
  -r, --raw           Output raw JSON (defaults to a table)
  -t, --type=<value>  Filter by address type

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List addresses
```

_See code: [src/commands/addresses/index.ts](https://github.com/Brale-xyz/brale-cli/blob/v0.0.0/src/commands/addresses/index.ts)_

## `brale base`

```
USAGE
  $ brale base [--json] [-r]

FLAGS
  -r, --raw  Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.
```

_See code: [src/commands/base.ts](https://github.com/Brale-xyz/brale-cli/blob/v0.0.0/src/commands/base.ts)_

## `brale financial-institutions`

List financial institutions

```
USAGE
  $ brale financial-institutions [--json] [-r]

FLAGS
  -r, --raw  Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List financial institutions
```

_See code: [src/commands/financial-institutions/index.ts](https://github.com/Brale-xyz/brale-cli/blob/v0.0.0/src/commands/financial-institutions/index.ts)_

## `brale help [COMMANDS]`

Display help for brale.

```
USAGE
  $ brale help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for brale.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.8/src/commands/help.ts)_

## `brale orders get ID`

Get order

```
USAGE
  $ brale orders get ID [--json] [-r]

ARGUMENTS
  ID  The id of the Order

FLAGS
  -r, --raw  Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get order
```

_See code: [src/commands/orders/get.ts](https://github.com/Brale-xyz/brale-cli/blob/v0.0.0/src/commands/orders/get.ts)_

## `brale plugins`

List installed plugins.

```
USAGE
  $ brale plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ brale plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/src/commands/plugins/index.ts)_

## `brale plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ brale plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ brale plugins add

EXAMPLES
  $ brale plugins add myplugin

  $ brale plugins add https://github.com/someuser/someplugin

  $ brale plugins add someuser/someplugin
```

## `brale plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ brale plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ brale plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/src/commands/plugins/inspect.ts)_

## `brale plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ brale plugins install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ brale plugins add

EXAMPLES
  $ brale plugins install myplugin

  $ brale plugins install https://github.com/someuser/someplugin

  $ brale plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/src/commands/plugins/install.ts)_

## `brale plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ brale plugins link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ brale plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/src/commands/plugins/link.ts)_

## `brale plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ brale plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ brale plugins unlink
  $ brale plugins remove

EXAMPLES
  $ brale plugins remove myplugin
```

## `brale plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ brale plugins reset
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/src/commands/plugins/reset.ts)_

## `brale plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ brale plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ brale plugins unlink
  $ brale plugins remove

EXAMPLES
  $ brale plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/src/commands/plugins/uninstall.ts)_

## `brale plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ brale plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ brale plugins unlink
  $ brale plugins remove

EXAMPLES
  $ brale plugins unlink myplugin
```

## `brale plugins update`

Update installed plugins.

```
USAGE
  $ brale plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/src/commands/plugins/update.ts)_

## `brale tokens`

List addresses

```
USAGE
  $ brale tokens [--json] [-r] [-t <value>]

FLAGS
  -r, --raw             Output raw JSON (defaults to a table)
  -t, --ticker=<value>  The ticker to filter by

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List addresses
```

_See code: [src/commands/tokens/index.ts](https://github.com/Brale-xyz/brale-cli/blob/v0.0.0/src/commands/tokens/index.ts)_

## `brale tokens deployments TICKER`

List addresses

```
USAGE
  $ brale tokens deployments TICKER [--json] [-r] [-c <value>]

ARGUMENTS
  TICKER  The ticker of the token to get deployments for

FLAGS
  -c, --chain=<value>  The chain id to filter by
  -r, --raw            Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List addresses
```

_See code: [src/commands/tokens/deployments.ts](https://github.com/Brale-xyz/brale-cli/blob/v0.0.0/src/commands/tokens/deployments.ts)_

## `brale tokens mint TICKER`

Mint tokens

```
USAGE
  $ brale tokens mint TICKER -a <value> -c <value> -d <value> [--json] [-r] [-n <value>] [-q <value> -p USDC|wire]

ARGUMENTS
  TICKER  The ticker of the token to mint

FLAGS
  -a, --amount=<value>         (required) The amount to mint
  -c, --chain=<value>          (required) The chain ID of the deployment/chain to mint on
  -d, --destination=<value>    (required) The destination address ID
  -n, --note=<value>           A note to add to the order
  -p, --payment=<option>       [default: wire] Payment
                               <options: USDC|wire>
  -q, --payment-chain=<value>  The USDC chain to pay from
  -r, --raw                    Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Mint tokens
```

_See code: [src/commands/tokens/mint.ts](https://github.com/Brale-xyz/brale-cli/blob/v0.0.0/src/commands/tokens/mint.ts)_

## `brale tokens redeem TICKER`

Mint tokens

```
USAGE
  $ brale tokens redeem TICKER -a <value> -c <value> -d <value> [--json] [-r] [-n <value>]

ARGUMENTS
  TICKER  The ticker of the token to mint

FLAGS
  -a, --amount=<value>       (required) The amount to mint
  -c, --chain=<value>        (required) The chain ID of the deployment/chain to mint on
  -d, --destination=<value>  (required) The destination address ID
  -n, --note=<value>         A note to add to the order
  -r, --raw                  Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Mint tokens
```

_See code: [src/commands/tokens/redeem.ts](https://github.com/Brale-xyz/brale-cli/blob/v0.0.0/src/commands/tokens/redeem.ts)_

<!-- commandsstop -->

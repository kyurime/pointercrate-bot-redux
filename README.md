# Pointercrate Bot Redux

A redo of my original Pointercrate bot with a focus on being a bit easier to use and more easily extendable.

## Todo

Much of this code is still in the process of being designed and should not be treated anywhere close to a finished product.
Currently, anything that requires authentication is unimplemented along with nearly all the getter endpoints.
Many of the configuration options are also unused and unimplemented.

## Usage

Due to using Discord's webhook-based slash commands, this _must_ be run on a webserver that can be accessed by Discord's interaction API.
As of right now, the libraries used to interface with the commands runs off of a bot token. Make sure the bot also has the slash commands scope.
Due to the unimplemented nature of most of the commands, they are currently set to install within a preconfigured test guild. Do not expect this to change until all the features of an endpoint are implemented.

Check the `.env.default` file for various configuration settings.
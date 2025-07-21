{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    { nixpkgs, ... }:
    let
      eachSystem = f: nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = eachSystem (pkgs: 
      {
        default = pkgs.mkShell {
          name = "discord-bot-template"; # TODO: Change me to your project name
          packages = with pkgs; [
            nodejs

            # Alternatively, you can use a specific major version of Node.js
            # nodejs-22_x

            # Use corepack to install npm/pnpm/yarn as specified in package.json
            corepack

            # Required to enable the language server
            nodePackages.typescript
            nodePackages.typescript-language-server

            # Python API Packages
            python3
          ];
        };
      });
    };
}

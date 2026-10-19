{
  description = "A minimal, configurable WebTUI landing page";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = {
    self,
    nixpkgs,
  }: let
    systems = [
      "x86_64-linux"
      "aarch64-linux"
      "x86_64-darwin"
      "aarch64-darwin"
    ];
    forAllSystems = nixpkgs.lib.genAttrs systems;
    defaults = builtins.fromJSON (builtins.readFile ./site.json);
  in {
    packages = forAllSystems (
      system: let
        pkgs = import nixpkgs {inherit system;};
        landingPage = pkgs.lib.makeOverridable (
          {
            title ? defaults.title,
            links ? defaults.links,
            accountLink ? defaults.accountLink,
          }:
            pkgs.buildNpmPackage {
              pname = "warm-vodka-landing-page";
              version = "1.0.0";
              src = pkgs.lib.cleanSourceWith {
                src = ./.;
                filter = path: type:
                  !(builtins.elem (baseNameOf path) [
                    "node_modules"
                    "dist"
                    "result"
                  ])
                  && pkgs.lib.cleanSourceFilter path type;
              };
              nodejs = pkgs.nodejs_24;
              npmDepsHash = "sha256-uzCsnVmx9DCBBnwApb72l4ftrwHFWFXgVNRrylPqwEA=";
              SITE_CONFIG = pkgs.writeText "landing-page-content.json" (
                builtins.toJSON {
                  inherit
                    title
                    links
                    accountLink
                    ;
                }
              );
              installPhase = ''
                runHook preInstall
                mkdir -p "$out"
                cp -r dist/. "$out/"
                runHook postInstall
              '';
            }
        ) {};
      in {
        default = landingPage;
        landing-page = landingPage;
      }
    );

    devShells = forAllSystems (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in {
        default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_24
            pkgs.nixfmt
            pkgs.prefetch-npm-deps
          ];
        };
      }
    );
  };
}

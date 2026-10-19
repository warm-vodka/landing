# warm.vodka landing page

## using

```nix
{ inputs, pkgs, ... }:
let
  landingPage =
    inputs.landing-page.packages.${pkgs.stdenv.hostPlatform.system}.default.override {
      title = "website.com";

      links = {
        link1 = "link1.example.com";
        link2 = "link2.example.com";
        link3 = "link3.example.com";
      };

      accountLink = {
        label = "manage your account";
        url = "account.example.com";
      };
      # Or: accountLink = null;
    };
in
{
  services.caddy = {
    enable = true;

    virtualHosts."warm.vodka".extraConfig = ''
      root * ${landingPage}
      file_server
    '';
  };

}
```

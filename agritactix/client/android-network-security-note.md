# Network Security Config

After running `npx cap add android`, edit this file:
`android/app/src/main/res/xml/network_security_config.xml`

Replace its content with:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">192.168.1.100</domain>
    </domain-config>
</network-security-config>
```

Replace 192.168.1.100 with your actual PC IP.

Also make sure AndroidManifest.xml has:
  android:networkSecurityConfig="@xml/network_security_config"
inside the <application> tag (Capacitor usually adds this automatically).

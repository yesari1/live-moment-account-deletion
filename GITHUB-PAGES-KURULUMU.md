# Live Moment hesap silme sayfası

Hedef adres: `https://account.yesastudio.com`

## 1. GitHub deposu

Uygulama kaynaklarını açık etmemek için mevcut private `LivingMemories` deposu
yerine ayrı bir public depo oluştur:

- Depo adı: `live-moment-account-deletion`
- Visibility: **Public**
- Bu `account-deletion-site` klasörünün içeriğini yeni deponun köküne koy.

GitHub'da **Settings → Pages → Build and deployment → Source** alanını
**GitHub Actions** olarak seç. `main` dalına yapılan her push siteyi otomatik
yayınlar.

## 2. GitHub özel alan adı

İlk başarılı yayından sonra:

1. GitHub deposunda **Settings → Pages** bölümünü aç.
2. **Custom domain** alanına `account.yesastudio.com` yazıp kaydet.
3. DNS doğrulandıktan sonra **Enforce HTTPS** seçeneğini aç.

## 3. Squarespace DNS

Squarespace Domains içinde `yesastudio.com` için DNS ayarlarını aç ve ekle:

| Tür | Host | Değer |
| --- | --- | --- |
| CNAME | `account` | `yesari1.github.io` |

`account` adına ait başka A, AAAA veya CNAME kaydı varsa çakışmaması için kaldır.
Ana alan adı ve `www` kayıtlarına dokunma.

DNS yayılımından sonra `https://account.yesastudio.com` adresini kontrol et.

## 4. Talep e-postası

`dist/config.js` içindeki `REPLACE_WITH_SUPPORT_EMAIL` değerini gerçek destek
veya gizlilik e-posta adresiyle değiştir. Bu yapılmadan form e-posta açmaz.

Son olarak bu HTTPS adresini Google Play Console'daki **Delete account URL**
alanına gir.

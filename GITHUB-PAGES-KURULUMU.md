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

`dist/config.js` içindeki `supportEmail` değeri form e-postasının gideceği adrestir
(29 Eylül 2026'da `1yesari1@gmail.com` yapıldı). Başka bir adres istersen bu değeri
değiştir. Değer `REPLACE_WITH_SUPPORT_EMAIL` kalırsa form e-posta açmaz ve
"yapılandırılmamış" hatası gösterir.

Son olarak bu HTTPS adresini Google Play Console'daki **Delete account URL**
alanına gir. Hesabı silmeden bazı verilerin silinmesi için ayrı bir sayfa vardır:
`https://account.yesastudio.com/delete-data/` adresini **Delete data URL** alanına gir
(bkz. bölüm 5).

## 5. Gizlilik ve şartlar sayfaları

`dist/privacy/`, `dist/terms/`, `dist/acceptable-use/`, `dist/kvkk/` ve `dist/delete-data/`
klasörleri aynı sitede yayınlanır (`/privacy/`, `/terms/`, `/acceptable-use/`, `/kvkk/`,
`/delete-data/`). Stil `dist/styles.css` değişkenlerini ve küçük bir `dist/legal.css`
dosyasını kullanır. `/delete-data/` sayfası İngilizce ve Türkçe içerik taşır; üstteki
EN/TR düğmesi ikisi arasında geçiş yapar (küçük bir satır içi script, İngilizce varsayılan).

Metinlerin kaynağı uygulama deposundaki `hosting/public/` klasörüdür. Metni orada
değiştirip şu komutu çalıştır, sonra bu depoya commit ve push yap:

```powershell
node D:\_MobileProjects\LiveMoment\tools\legal-site\build-site-legal.js D:\_MobileProjects\LiveMoment D:\_WebProjects\LiveMomentSite\dist
```

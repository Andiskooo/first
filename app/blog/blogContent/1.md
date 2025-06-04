# Si të aktivizoni funksionin e lidhjes Wi-Fi të Kondicionerëve CANDY


![Kondicioner modern në shtëpi](https://images.unsplash.com/photo-1742832599361-7aa7decd73b4?w=1200&h=800&fit=crop&crop=faces,edges&auto=format&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)


## Përshkrim i shkurtër
Kjo udhëzues do t'ju ndihmojë të lidhni kondicionerin tuaj CANDY me rrjetin Wi-Fi përmes aplikacionit hOn, duke ju lejuar të kontrolloni pajisjen tuaj nga kudo.


## Hapat për lidhje

### 1. Përgatitja e pajisjeve
Para se të filloni, sigurohuni që keni:

- [x] Telefon ose tablet me sistem operativ iOS 9.0+ ose Android 5.0+
- [x] Rrjet Wi-Fi funksional
- [x] Aplikacioni hOn i instaluar
- [ ] Kondicioneri i ndezur dhe në modalitetin e duhur

### 2. Procesi i lidhjes

1. **Hapni aplikacionin hOn** në pajisjen tuaj
2. Shtypni butonin **"+"** për të shtuar një pajisje të re
3. Zgjidhni **"Klima"** dhe më pas markën **CANDY**
4. Ndiqni udhëzimet në ekran për të konfiguruar lidhjen

### 3. Konfigurimi i Wi-Fi

Për të konfiguruar lidhjen Wi-Fi:

1. Mbani të shtypur butonin **"LIGHT"** për 5 sekonda
2. Pajisja do të fillojë të pulsojë me ngjyrë të kuq
3. Zgjidhni rrjetin tuaj Wi-Fi dhe futni fjalëkalimin
4. Prisni që pajisja të konfirmojë lidhjen

## Kërkesat teknike

### Pajisjet e kërkuara

| Pajisja | Kërkesat minimale |
|---------|------------------|
| Telefon | iOS 9.0+ ose Android 5.0+ |
| Ruter Wi-Fi | 2.4GHz, WPA/WPA2 |
| Kondicioneri | Modeli i përkrahur CANDY |

### Kodi shembull për integrim

```javascript
// Shembull kodi për integrimin e API
const connectToDevice = async (deviceId) => {
  try {
    const response = await fetch(\`https://api.honn.com/devices/\${deviceId}/connect\`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ssid: 'YOUR_WIFI_SSID',
        password: 'YOUR_WIFI_PASSWORD'
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Gabim gjatë lidhjes:', error);
  }
};
```

## Përfitimet e lidhjes Wi-Fi

- **Kontroll i largët**: Ndryshoni temperaturën nga kudo
- **Programim**: Vendosni orare për ndezje/fikje automatike
- **Efikasitet**: Monitoroni përdorimin e energjisë
- **Njoftime**: Merrni njoftime për mirëmbajtje dhe gabime

## Pyetje të shpeshta

### A mund të lidh më shumë se një pajisje?
Po, mund të lidhni deri në 10 pajisje në një llogari të vetme hOn.

### Çfarë duhet të bëj nëse lidhja dështon?
1. Kontrolloni nëse Wi-Fi është i ndezur
2. Verifikoni që jeni të lidhur me rrjetin e duhur
3. Provoni të rivendosni pajisjen dhe aplikacionin
4. Kontaktoni asistencën teknike nëse problemi vazhdon

## Konkluzion
Lidhja e kondicionerit tuaj me Wi-Fi nuk është vetëm e lehtë, por gjithashtu sjell shumë përfitime për përdoruesin përfundimtar. Me vetëm disa prekje në ekranin e telefonit tuaj, mund të përmirësoni ndjeshëm komoditetin në shtëpi dhe kurseni energji.

> **Këshillë profesionisti:** Për performancë më të mirë, sigurohuni që pajisja juaj të jetë gjithmonë e përditësuar me versionin më të ri të firmware-it.

Për më shumë informacion, vizitoni [faqen zyrtare të CANDY](https://www.candy-home.com).

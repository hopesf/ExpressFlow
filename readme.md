
# ExpressFlow Backend

Bu projenin genel amacı rest mimarisinde ilerleyen backend servislerimiz ile haberleşebilmek ve bu iletişimi tek bir endpoint'ten yapabilmeyi sağlamaktır.


## Ortam Değişkenleri

Toplam 3 adet .env dosyamız var. Önce bu dosyaları oluşturun.

`.env.development`
`.env.production`
`.env.test`

Bu projeyi çalıştırabilmek için aşağıdaki ortam değişkenlerini .env dosyalarınıza eklemeniz gerekecek.

`PORT=3000`

`MONGODB_URI= mongodb url here`

  
## Kullanım/Örnekler

Projeyi development ortamında çalıştırmak için

```bash
npm run dev
```

  
Projeyi production ortamında çalıştırmak için

```bash
npm run start
```

Projeyi build almak için

```bash
npm run build
```
## API Kullanımı

#### Tüm Dökümanyasyonun Linki

```http
  GET /docs
```

#### Dökümanyasyonun JSON Çıktısı İçin

```http
  GET /docs.json
```

  
## Testler

Testleri çalıştırmak için aşağıdaki komutu çalıştırın

```bash
  npm run test
```

  
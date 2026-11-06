# B2B Portal — Uğur Giyim Sipariş ve Stok Yönetim Sistemi

Üniversite projesi olarak geliştirilmiş, bayi (B2B) sipariş yönetimi, stok takibi, otomatik tekrarlı sipariş ve sadakat programı özellikleri içeren web uygulaması.

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Backend | Java 21, Spring Boot 4.1.0, Spring Data JPA, Maven |
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| Veritabanı | MSSQL (Azure SQL Edge, Docker) |
| Ek | Lombok, BCrypt (şifre hashleme) |

## Gereksinimler

- **Java JDK 21** — [Adoptium](https://adoptium.net) veya [Oracle](https://www.oracle.com/java/technologies/downloads/)
- **Docker Desktop** — [Docker Hub](https://www.docker.com/products/docker-desktop/) (Windows ve macOS için)
- **Git** — [git-scm.com](https://git-scm.com)

## Repo Yapısı

```
b2b-portal/
├── src/                    # Spring Boot backend
├── frontend/               # Vanilla JS frontend
│   ├── index.html          # Bayi giriş + mağaza
│   ├── admin.html          # Yönetim paneli
│   └── js/                 # Servis katmanı + görünümler
├── database/
│   ├── init.sql            # Veritabanı şeması + örnek veriler
│   └── *.sql               # Ek SQL dosyaları
├── docker-compose.yml      # MSSQL Docker kurulumu
└── pom.xml                 # Maven bağımlılıkları
```

## Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/ugurda25/b2b-portal.git
cd b2b-portal
```

### 2. Veritabanı (Docker)

**Windows (PowerShell) ve macOS / Linux:**

```bash
docker compose up -d
```

Veritabanı şemasını ve örnek verileri yükleyin:

**macOS / Linux (Terminal):**

```bash
docker exec -i b2b-mssql /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong!Passw0rd' \
  -i /dev/stdin < database/init.sql
```

**Windows (PowerShell):**

```powershell
Get-Content database\init.sql | docker exec -i b2b-mssql /opt/mssql-tools/bin/sqlcmd `
  -S localhost -U sa -P 'YourStrong!Passw0rd' -i /dev/stdin
```

> **Güvenlik notu:** `docker-compose.yml` içindeki varsayılan şifre sadece yerel geliştirme içindir. Üretim ortamında `MSSQL_SA_PASSWORD` ortam değişkenini güçlü bir şifreyle değiştirin.

### 3. Backend (Spring Boot)

Önce `DB_PASSWORD` ortam değişkenini ayarlayın:

**macOS / Linux:**

```bash
export DB_PASSWORD='YourStrong!Passw0rd'
./mvnw spring-boot:run
```

**Windows (PowerShell):**

```powershell
$env:DB_PASSWORD='YourStrong!Passw0rd'
.\mvnw.cmd spring-boot:run
```

**Windows (CMD):**

```cmd
set DB_PASSWORD=YourStrong!Passw0rd
mvnw.cmd spring-boot:run
```

Backend `http://localhost:8080` üzerinde çalışır.

### 4. Frontend

Frontend statik dosyalardan oluşur. Herhangi bir statik sunucuyla servis edilebilir:

**macOS / Linux (Python):**

```bash
cd frontend
python3 -m http.server 3000
```

**Windows (PowerShell — Python varsa):**

```powershell
cd frontend
python -m http.server 3000
```

**Alternatif (Node.js varsa, her iki platform):**

```bash
cd frontend
npx serve -p 3000
```

`http://localhost:3000` adresinden erişilir.

> **Not:** Frontend ES Modules kullandığı için `file://` üzerinden açılamaz; mutlaka bir HTTP sunucusu üzerinden servis edilmelidir.

## Test Kullanıcıları

| Kullanıcı Adı | Şifre | Rol |
|---------------|-------|-----|
| `admin` | `Test123!` | ADMIN (Yönetici) |
| `marmara_giyim` | `Test123!` | BAYI (Bayi) |
| `akdeniz_giyim` | `Test123!` | BAYI (Bayi) |

> Tüm örnek kullanıcı şifreleri `Test123!` olarak maskelenmiştir.

## Özellikler

- **Bayi Girişi** — Kullanıcı adı / şifre ile oturum açma
- **Ürün Kataloğu** — Stok, toptan fiyat, minimum sipariş adedi
- **Sepet & Sipariş** — Sipariş oluşturma, durum takibi (PENDING / APPROVED / DELIVERED / CANCELED)
- **Otomatik Tekrarlı Sipariş** — Haftalık/aylık periyodik sipariş (Scheduler destekli)
- **Bakiye & Kredi Limiti** — Bayi bakiye yönetimi
- **Sadakat Programı** — Puan tabanlı ödül sistemi
- **Yönetici Paneli** — Bayi yönetimi, ürün CRUD, sipariş onay, dashboard

## API Ana Hatları

| Endpoint | Açıklama |
|----------|----------|
| `POST /api/Users/login` | Giriş |
| `GET /api/Products` | Ürün listesi |
| `POST /api/Orders` | Sipariş oluştur |
| `GET /api/Orders/user/{id}` | Kullanıcı siparişleri |
| `POST /api/RecurringOrders` | Tekrarlı sipariş |
| `GET /api/AdminDashboard` | Dashboard verisi |

## Güvenlik Notları

- Kullanıcı şifreleri **BCrypt** ile hashlenir (eski düz metin kayıtlar için geriye dönük uyumluluk mevcuttur)
- Veritabanı şifresi ortam değişkeni (`DB_PASSWORD`) ile sağlanır, koda gömülmez
- `init.sql` içindeki tüm kullanıcı şifreleri maskelenmiştir
- Bu proje eğitim amaçlıdır; üretim ortamı için JWT/OAuth2, HTTPS ve CORS kısıtlaması eklenmelidir

## Lisans

Bu proje üniversite dersi kapsamında geliştirilmiştir.

# Holiday Finder

## Introducere

Holiday Finder este o aplicație web dezvoltată cu ajutorul framework-ului Angular, reprezentând un motor de căutare dedicat sărbătorilor din diferite țări ale lumii.

Trebuie menționat faptul că există anumite limitări ale aplicației, dar nu funcționale, ci din cauza unui număr limitat de request-uri permise lunar de către unul dintre API-urile utilizate. Astfel, pentru a rămâne în limita gratuită a numărului de request-uri de 1000/lună, pentru prezentarea aplicației au fost folosite doar țările din Uniunea Europeană.

## Descriere problemă

Holiday Finder își propune să faciliteze accesul către o bază de date centralizată a tuturor sărbătorilor recunoscute din punct de vedere legal de către diferite țări din întreaga lume, prin culegerea și expunerea datelor într-un format simplu și plăcut, cu posibilitatea filtrării conținutului prin selectarea unui anumit an și introducerea unor cuvinte cheie, precum numele unei anumite țări sau a unei anumite sărbători. 

Astfel, daca se introduce doar anul, acesta fiind obligatoriu pentru realizarea căutării, vor fi afișate toate sărbătorile din acel an pentru toate țările din baza de date. Dacă pe lângă an se va introduce și numele unei țări, vor fi afișate toate sărbătorile din anul respectiv pentru țara specificată. De asemenea, dacă în locul numelui unei țări se va folosi numele unei sărbători, se vor afișa toate sărbătorile din anul respectiv pentru țările în care se regăsește și sărbătoarea cu numele specificat.

Pentru a ilustra utilitatea practică a unei astfel de aplicații, vom menționa câteva posibile cazuri de utilizare:
-	Planificarea unei vacanțe, utilizându-se fie pentru a identifica diferite sărbători din destinația dorita, fie pentru a descoperi în ce perioadă a anului destinația poate fi mai atractivă
-	O mai bună înțelegere a culturilor din anumite societăți sau țări, prin descoperirea a ceea ce este celebrat de către popor, dar chiar și prin numărul propriu-zis de sărbători recunoscute de către stat
-	Planificarea activității unei companii, luând în considerare sărbătorile legale din diferite țări în care compania își desfășoară activitatea

## Descriere API-uri

Calendarific este un API utilizat pentru furnizarea datelor referitoare la sărbătorile dintr-o anumită țară. Informațiile preluate prin ajutorul acestui API sunt:
-	Numele unei țări
-	Numele sărbătorilor și data aferentă fiecăreia dintre ele
-	O descriere scurtă a fiecăreia dintre sărbători
Informațiile sunt primite sub forma unei matrice populate cu obiecte JSON.


Country Flags este un API utilizat pentru desenarea în pagină a steagului unei anumite țări, această componentă fiind prezentă pentru toate țările afișate pe pagină în orice moment.
Imaginea este încărcată direct prin intermediul URL-ului prin care se face cererea de tip GET către resursă.
Pentru ambele API-uri este folosit sistemul de codare ISO 3166-1(Alpha 2) pentru reprezentarea denumirilor țărilor și a subdiviziunilor acestora, stocate într-o matrice constantă dintr-un fișier al aplicației. 

## Flux de date

Atunci când utilizatorul accesează pagina de destinație, care folosește ruta ‘/’, este întâmpinat de către un ecran informativ care arată numele aplicației și o scurtă descriere a funcționalității acesteia, dar și un buton ce îl poate redirecționa către pagina de căutare. De asemenea, o parte statică a aplicației reprezintă bara de instrumente prezentă în toate ecranele aplicației, prin care se poate realiza navigarea facilă între pagini. 

În momentul în care utilizatorul este redirecționat sau apelează explicit pagina de căutare, care folosește ruta ‘/search’, îi este prezentată o bară de căutare formată din doua input-uri și logo-ul aplicației. Dacă utilizatorul introduce un an valid, se vor preîncărca toate țările disponibile și vor fi afișate. În cazul în care se introduc și cuvinte cheie de căutare, țările disponibile se vor filtra pe baza acestor cuvinte, iar mai apoi vor fi afișate.

Preluarea datelor de la ambele API-uri se face prin intermediul unui serviciu personalizat denumit ‘CountryDataService’.

Pentru preluarea imaginii cu steagul unei anumite țări se folosește următoarea funcție:
```
  public getFlag(countryCode: string): string {
    return this.baseFlagsUrl + countryCode + '/flat/64.png';
  }
```
Aici parametrul de intrare reprezintă codul ISO al unei anumite țări și variabila baseFlagsUrl reprezintă domeniul API-ului stocat într-o variabilă constantă într-un alt fișier (COUNTRYFLAGS_BASE_URL = 'https://www.countryflags.io/'). Astfel, imaginile folosesc adesea drept sursă URL ce funcționează ca un GET către resursă.

Pentru încărcarea detaliilor despre sărbătorile din toate țările stocate în sistem se folosește o cerere de tip GET, asincronă, la răspunsul căreia trebuie să ne abonăm, prin următoarea funcție:

```
public loadCountries() {
    this.countryStore.countries = [];
    
    if (this._searchYear.value != 0) {
      for (const code of this.countryCodes) {
        this.http
          .get(
            this.baseCalendarificUrl +
              '&country=' +
              code +
              '&year=' +
              this._searchYear.value
          )
          .subscribe((data: { meta: any; response: any }) => {
            let countryName = '';
            let countryHolidays = [];
            
            if (data && data.response.holidays != undefined) {
              countryName = data.response.holidays[0].country.name;
              for (const holiday of data.response.holidays) {
                countryHolidays.push({
                  name: holiday.name,
                  date:
                    holiday.date.datetime.day +
                    '/' +
                    holiday.date.datetime.month +
                    '/' +
                    holiday.date.datetime.year,
                  description: holiday.description,
                  type: holiday.type,
                });
              }
              
              this.countryStore.countries.push({
                name: countryName,
                code: code,
                holidays: countryHolidays,
              });
              this._countries.next(
                Object.assign({}, this.countryStore).countries
              );
            }
          });
      }
    }
  }
  ```

În cadrul acestei funcții:
-	countryStore este un obiect ce stochează o matrice a tuturor obiectelor personalizate Country.

```
export interface Country {
  name: string;
  code: string;
  holidays: Holiday[];
}

export interface Holiday {
  name: string;
  date: string;
  description: string;
  type: string[];
}
```
-	_searchYear reprezintă o variabilă observabilă ce stochează anul introdus de către utilizator

-	countryCodes reprezintă o variabilă ce stochează matricea codurilor ISO
```
Ex: EUROPEAN_UNION_COUNTRY_CODES = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
];
```
-	baseCalendarificUrl reprezintă domeniul API-ului stocat într-o variabilă constantă (CALENDARIFIC_BASE_URL = 'https://calendarific.com/api/v2/holidays').

-	_countries este variabila observabilă ce stochează matricea obiectelor de tip Country, la care restul componentelor se pot abona pentru a primi actualizări în timp real.

Dacă pentru API-ul Country Flags nu este nevoie de nici un fel de autorizare, în schimb, API-ul Calendarific utilizează o cheie de identificare pentru a permite cererile către resurse. Pentru o cheie gratuită există limita de 1000 request-uri/lună, așa cum este menționat și în descrierea problemei. Cheia este stocată într-o variabilă și este adăugată în fiecare request prin parametrul ‘api_key’.

Ex: CALENDARIFIC_API_KEY = 'f524f29ff189ff628ef5b1f0180ade5f887fe8ae'

## Capturi de ecran

Pagina de pornire a aplicației

<img width="1680" alt="Welcome Screen" src="https://user-images.githubusercontent.com/83829084/117582272-e7fef580-b109-11eb-9a4b-759c14dda134.png">

Pagina de căutare a aplicației

<img width="1680" alt="Search Screen" src="https://user-images.githubusercontent.com/83829084/117582313-18469400-b10a-11eb-95e3-51d0c31c1b57.png">


Afișarea tuturor sărbătorilor din anul 2021 pentru toate țările din sistem

<img width="1679" alt="Afisarea tuturor sarbatorilor din 2021" src="https://user-images.githubusercontent.com/83829084/117582224-9ce4e280-b109-11eb-938a-05955e9ef373.png">

Afișarea tuturor sărbătorilor din anul 2021 pentru o anumită țară

<img width="1680" alt="Afisarea pentru o anumita tara" src="https://user-images.githubusercontent.com/83829084/117582321-24caec80-b10a-11eb-91de-bb938f073f89.png">




## Rulare locală

Pentru rularea locală a proiectului, este nevoie de Node.js si Angular CLI.
(daca Angular CLI nu este instalat se poate folosi comanda 'npm install -g @angular/cli')

Se utilizează următoarele comenzi:
```
npm install
npm start
```

## Publicare

Aplicația a fost publicată utilizând Heroku și poate fi accesată aici: https://vacation-app-cc.herokuapp.com/.

## Referințe

1.	[Country Flags API](https://www.countryflags.io/)
2.	[Calendarific: Enterprise-Grade Bank and Public Holidays API](https://calendarific.com/)
3.	[List of ISO 3166 country codes - Wikipedia](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)


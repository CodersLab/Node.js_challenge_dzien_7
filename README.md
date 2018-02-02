<img alt="Logo" src="https://coderslab.pl/svg/logo-coderslab.svg" width="400">

# Node.js challenge

Witaj w challengu Node.js, gdzie codziennie przez 7 dni zdobędziesz konkretną dawkę informacji dotyczących Node.js oraz wykorzystasz ją w praktyce. **Pamiętaj żeby wykonywać dni challengu po kolei - od dnia pierwszego do ostatniego** (dzięki temu Twoja wiedza będzie poukładana i kompletna).

Każdy dzień to jeden temat przewodni. W jego ramach **stworzysz aplikację Node.js, która faktycznie będzie potrafiła coś zrobić** - od razu zobaczysz wynik swojej pracy.

___

> Kilka ważnych informacji

Przed przystąpieniem do rozwiązywania zadań przeczytaj poniższe wskazówki

**Do pełnego i satysfakcjonującego doświadczania tego challengu jest potrzebna znajomość JavaScript z elementami ES6.** Jeżeli potrzebujesz informacji z zakresu ES6 to znajdziesz je tutaj: [*tutorial ES6*][es6-tutorial].

## Jak zacząć?

1. Stwórz [*fork*][forking] repozytorium z zadaniami.
2. [*Sklonuj*][ref-clone] repozytorium na swój komputer.

Poszczególne zadania rozwiązuj w odpowiednich plikach.

## Plan challengu

* Pierwszy dzień to wstęp do Twojej przygody z Node.js - dowiesz się w jaki sposób przygotować środowisko oraz jak pisać i testować programy Node.js.
* W kolejnych dniach dowiesz się w jaki sposób za pomocą Node.js wchodzić w interakcję z systemem operacyjnym (np. modyfikować pliki czy dokonywać szyfrowania).
* Druga część challengu jest poświęcona tworzeniu back-endu - dowiesz się jak stworzyć własny serwer.
* Pod koniec doświadczysz roli full-stack developera - stworzysz komunikujący się ze sobą front-end i back-end.  

___

# Dzień 7: Starcie Ostateczne, czyli interaktywna aplikacja webowa

Pozostało kilka drobnych rzeczy zanim będziesz gotowy/a na interaktywne połączenie swoich aplikacji. Są to: zapis danych po stronie back-endu oraz obsługa zapytań AJAXowych/JSON.

## Odczyt po stronie back-endu

Zobaczysz teraz przykładową metodę zapisu/odczytu na stałe danych po stronie back-endu. Oznacza to, że nawet po restarcie Twojego programu/serwera/komputera - dane pozostaną i będą mogły być wykorzystywane później. Skorzystamy do tego po prostu z wiedzy z pierwszych dni - **będziemy odczytywali/zapisywali plik JSON.**

> **Uwaga! Stosowana tutaj metoda jest dobra do szybkiego prototypowania, ale w praktyce istnieją dużo lepsze metody przechowywania danych.** Korzystanie z plików w taki sposób jaki zrobimy ma duży plus: jest proste i szybkie w wykonaniu. Minusami natomiast są np.: niska prędkość, problemy z konkurencyjnością (oba problemy pojawiają się, gdy z serwisu korzysta wiele osób). **W praktyce wykorzystuje się bazy danych, jednak ich temat jest bardzo obszerny.** Jeżeli chcesz to możesz po tym dniu zgłębić wiedzę na temat np. bazy MongoDb.

Korzystając z wiedzy zdobytej w poprzednich dniach - zobaczmy w jaki sposób można odczytać dane znajdujące się w JSONie i zwrócić je do front-endu:

```JavaScript
// (...)

app.get('/shopping_list', (req, res) => { //Kiedy otrzymamy zapytanie o /shopping_list...
    fs.readFile('./data/przykladOdczyt/db.json', (err, data) => { //...odczytujemy plik z danymi
        if (!err){ //Jeżeli nie ma błędu
            const shoppingList = JSON.parse(data); //Parsujemy informacje z pliku - ponieważ są tam zapisane w formacie JSON. Następnie je wyświetlami:
            res.send('Lista zakupów: ' + shoppingList.join(', '));
        } else { //Jeżeli był błąd to informujemy użytkownika i wyświetlamy w konsoli szczegóły błędu
            console.log('Błąd odczytu pliku', err);
            res.send('Wystąpił błąd odczytu.');
        }
    });
});

// (...)
```

Przyjrzyj się temu przykładowi, żeby dobrze rozumieć co tam się dzieje. 

## Zapis po stronie back-endu

Analogicznie będzie wyglądać zapis danych. Powiedzmy, że chcemy dodać nowy element w jakiejś ścieżce. Możemy to uczynić np. tak:

```JavaScript
// (...)

app.get('/add', (req, res) => {
    fs.readFile('./data/przykladOdczyt/db.json', (err, data) => {//Odczytaj plik
        if (!err){
            //Jeżeli jest ok, to wczytaj dane z JSONa do tablicy:
            const shoppingList = JSON.parse(data);
            //Dodaj nowy element:
            shoppingList.push('Okulary przeciwsłoneczne');
            //Zamień zaktualizowaną tablicę znów na JSON:
            const jsonToWrite = JSON.stringify(shoppingList);

            fs.writeFile('./data/przykladOdczyt/db.json', jsonToWrite, (err, data) => {//Zapisz plik
                if (!err) {
                    res.send('Dodano.');
                } else {
                    console.log('Błąd zapisu pliku', err);
                    res.send('Wystąpił błąd zapisu.');
                }
            });
        } else {
            console.log('Błąd odczytu pliku', err);
            res.send('Wystąpił błąd odczytu.');
        }
    });
});

// (...)
```

**Cały ten przykład zapisu i odczytu znajdziesz w pliku `app/przykladOdczytZapis.js`.**

## AJAX

Prawdziwej interaktywności do naszej aplikacji doda możliwość przesyłania danych z front-endu do back-endu za pomocą np. AJAX (lub `fetch()`). Po stronie front-endu prawdopodobnie doskonale znasz taki kod (zwróć tylko uwagę na to, że trzeba ręcznie w nagłówku zapytania poinformować back-end, że będzie miał do czynienia z JSONem):

```JavaScript
$.ajax({
    url : '/sciezka/na/backendzie',
    data : JSON.stringify({
        name : 'Imię',
        surname : 'Nazwisko',
    }),
    headers: {
    	'Content-Type': 'application/json',
    },
    type : 'POST',
    dataType : 'json',
}).then(ans => {
    console.log('Odpowiedź z back-endu:', ans);
});
``` 

Wersja z `fetch()`:


```JavaScript
fetch('/sciezka/na/backendzie', {
	method : 'POST',
	body : JSON.stringify({
        name : 'Imię',
        surname : 'Nazwisko',
    }),
    headers: {
    	'Content-Type': 'application/json',
    },
})
.then(r => r.json())
.then(ans => {
    console.log('Odpowiedź z back-endu:', ans);
});
```

To jest właśnie przesyłanie danych JSON-em i ich odbieranie w tym samym formacie. Oczywiście taki zapis jest poprawny i będziemy go używali również z Expressem.

## Odbiór danych przesłanych AJAXem

Front-end już wie jak wysyłać dane. Teraz skupmy się na stronie serwerowej. Po pierwsze skorzystamy z wcześniej używanego przez nas `body-parser`. Tym razem wskażemy mu, żeby automatycznie odkodował wiadomości, które przyjdą do nas w formacie JSON:

```JavaScript
app.use(bodyParser.json());
```

> Możesz łączyć więcej odkodowań `body-parser`. Działają one na podstawie nagłówków typu pliku, więc na siebie wzajemnie nie wpływają. Możesz np. użyć w jednym programie `app.use(bodyParser.urlencode())` i `app.use(bodyParser.json())`.

Wtedy tradycyjnie - `req.body` - będzie w każdym zapytaniu przechowywać dane rozkodowane z JSONa.

Wiemy już jak odczytać dane z JSONa. A jak odpowiedzieć JSONem w wygodny sposób? Express przygotował wygodną metodę odpowiedzi: `res.json(dane)`. Podaj dowolne dane jako argument, a Express ustawi odpowiednie nagłówki odpowiedzi i zamieni te dane w JSONa.

Zobacz ten przykład, który odbiera i odsyła JSONa:

```JavaScript
// (...)

app.post('/sciezka/na/backendzie', (req, res) => {
    const {name, surname} = req.body; //Skrótowy zapis ES6
    res.json({
        info : 'Podałeś/aś imię ' + name + ' i nazwisko ' + surname,
    });
});

// (...)
```

**Uwaga:** zwróć uwagę, że użyliśmy tutaj `app.`**`post()`** (zamiast `app.get()`). To wynika z tego, że **dane przesyłamy metodą HTTP `POST`.**

Cały przykład komunikacji AJAXowej front-endu z back-endem znajdziesz w pliku `app/przykladAjax.js`.


# Ćwiczenia

> Ćwiczenia wykonuj w odpowiednich plikach. W folderze `app` są one ponumerowane tak samo jak poniżej - zadaniu `1. Rozgrzewka` odpowiada plik `app/zadanie01.js` itd.
> Aby uruchomić zadanie podaj jego nazwę (pamiętaj, aby linia komend/terminal był otwarty na katalogu `app` tego repozytorium), np.:
> ```cmd
> node ./zadanie01.js
> ```

> Pamiętaj, aby zainicjować npm i zainstalować wymagane moduły!

## Zadanie dnia: Interaktywna aplikacja webowa - lista zadań do zrobienia

Twoim zadaniem jest stworzyć aplikację webową Express, w której możesz przechowywać listę rzeczy do zrobienia. 

Aplikacja ma spełniać takie założenia:

- Dane mają pozostać nawet kiedy wyłączysz komputer, nie mają znikać. Mają być dostępne takie same niezależnie od użytej przeglądarki (dane mają być zapisywane w pliku).
- Wszystkie rzeczy powinny wykonywać się bez żadnego przeładowania, w ramach strony głównej (użyj do wszystkiego AJAXa).

Pliki statyczne znajdziesz w folderze `'./public/zadanieDnia/'`. Możesz dowolnie je modyfikować - jest tam gotowy szablon aplikacji To Do.

Powinno dać się wyświetlać już istniejące zadania, dodawać nowe, modyfikować, usuwać, oznaczać i odznaczać jako zakończone.

> Podpowiedź 1: przechowuj zadania w formie obiektu: z tekstem oraz informacją boolean o tym czy zakończono.
> 
> Podpowiedź 2: aby aktualizować, oznaczać i odznaczać zadania posłuż się ich indeksem - i go wysyłaj do backendu.
>
> Podpowiedź 3: po modyfikacji, oznaczeniu lub odznaczeniu możesz po prostu usunąć wszystko z widoku i wysłać ponownie zapytanie do back-endu o aktualną listę. Dzięki temu unikniesz desynchronizacji (choć nie jest to najwydajniejszy sposób).

**Powodzenia!**

---

**To wszystko w naszym tygodniowym challengu z Node.js - gratulacje, że jesteś już w tym miejscu!** Mamy nadzieję, że poczułeś jak to jest być Node.js developerem, jak to tworzyć back-end i w jaki sposób pracuje full-stack developer.

> Pamiętaj, że informacje tu zawarte to jedynie wierzchołek góry lodowej. Miały one na celu przyjemną i szybką edukację z podstaw oraz pokazanie Ci w jaki sposób działa Node.js. Wykorzystywane metody, funkcje i moduły podczas tego tygodnia występują często również w bardziej zaawansowanych czy innych formach. Naszą intencją było, by nauka była jak najprostsza i by unikać potencjalnych problemów - stąd znajdowały się tu pewne uproszczenia.

> Jeżeli sposobało Ci się to co tutaj budowałeś/aś to warto zainteresować się bardziej Node-m! Zobaczysz, że praca w nim w praktyce wygląda bardzo podobnie do tego co już poznałeś/aś. Zapraszamy również na kurs Node.js do Coders Lab :) Więcej na naszej stronie, pierwsza edycja już na początku marca - mam nadzieję, że spotkamy się tam osobiście. Cześć i powodzenia!
> 
> _Jakub Król, autor kursu Node.js w Coders Lab_ 

<!-- Links -->
[forking]: https://guides.github.com/activities/forking/
[ref-clone]: http://gitref.org/creating/#clone
[es6-tutorial]: http://qnimate.com/post-series/ecmascript-6-complete-tutorial/
[download-node]: https://nodejs.org/en/download/
[localhost]: http://localhost:3000
[localhost127]: http://127.0.0.1:3000
[httpcats]: http://http.cat/
[httpdogs]: https://httpstatusdogs.com/
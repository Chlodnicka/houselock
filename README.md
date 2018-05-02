# Houselock

##Instalacja 

1. Utwórz serwer (może być za pomocą xamppa, dockera, vagranta + scotchbox)
https://www.vagrantup.com/docs/installation/
https://box.scotch.io/ 
2. Dodaj wpis z adresem do pliku hosts np.:
<pre>
192.168.33.10  app_houselock.local
</pre>
3. Jeśli użyłeś scotchboxa - wrzuć pliki aplikacji do folderu public i odpal ją wpisując w przeglądarce adres hosta/www/

Z serwerem chodzi o to, że Onsen UI robi requesty ajaxem do plików z szablonami i nie ogarnia, jak się otworzy plik index.html w przeglądarce. 


## Dane do logowania 
1. Na etapie tworzenia aplikacji dostępne można zalogować się do aplikacji jako:
 - właściciel mieszkania - email: landlord@houselock.pl, hasło: testtest
 - lokator - email: tenant1@houselock.pl, hasło: testtest
 
## Formularze

Proponuję rozwązać wszelkie formularze edycji czegokolwiek jak w przypadku formularza edycji danych użytkownika: userPage
 - Tworzymy obiekt formularza wg schematu: <ons-list-item> - nieedytowalna informacja o czymś - widoczna odrazu i div z display:none z polem formularza: 

```html
    let element = 
        ons.createElement(
            '<div>
                <ons-list-item>nazwa mieszkania</ons-list-item>
                <div class="edit" style="display: none;">
                    <ons-input name="name" modifier="underbar" placeholder="Nazwa" value="' + name + '" float class="edit hidden"></ons-input>
                    </div><ons-button style="display:none;" modifier="large" component="button/save">Zapisz</ons-button>
                </div>);'
        );
```

 - Dodajemy na stronie przycisk edytuj: 
```html
<ons-fab position="bottom right" component="button/edit">
                <ons-icon icon="md-edit"></ons-icon>
            </ons-fab>
```

 - Pod koniec renderowania szablonu wrzucamy akcję: <pre>myApp.services.common.edit(page);</pre> - jest odpowidzialna za włączanie trybu edycji


## Wysyłanie danych

Są dwie metody:

### ajax.send()
<pre>
ajax.send(method, action, data, onSuccess, onFail);
</pre>

argumenty: 
 - method - metoda: POST/GET
 - action - np. /api/all
 - data - dane w formacie json, które chcemy wysłać np. {name: value, name: value}
 - onSuccess - nazwa funkcji, która ma się wywołać jeśli akcja się powiedzie
 - onFail - jw. tylko w przypadku niepowodzenia
 
 
### ajax.sendForm()

<pre>
ajax.sendForm(page, onSuccess, onFail);
</pre>

argumenty: 
 - page: strona, na której szukamy znacznika form np. userPage, flatPage itd. 
 - onSuccess i onFail analogiczne jw
 
 Jeśli chodzi o tę metodę wywołujemy ją raczej na onClick jakiego elementu, który ma obsłużyć wysłanie formularza do konkretnego endpointu - jeśli formularz jest poprawnie wygenerowany tj. ma atrbut metoda, akcja i pola zrobione zdefinionwane jak w sekcji o tworzeniu formularzy to funkcje w pliku assets/js/ajax.js zserializują dane z formularza i wyślą tam gdzie trzeba.
 
 
 ## Uwagi
 
 Podpięłam zewnętrzne api - logowanie i pobieranie danych działa.
 Można zaimplementować wysyłanie danych na podane w trello endpointy, na razie api będzie zwracać 500.
 
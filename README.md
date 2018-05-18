# Houselock
Aplikacja do zarządzania mieszkaniem

## Opis aplikacji
Aplikacja ma za zadanie służyć właścicielom i lokatorom do utrzymywania porządku w rachunkach i płatnościach za mieszkanie oraz ułatwiać komunikację między nimi jeśli chodzi o sumy rachunków, odczyty liczników i terminy płatności.

### Scenariusz korzystania z aplikacji:
1. Właściciel rejestruje się, dodaje swoje mieszkanie i wysyła z jej poziomu zaproszenia na maile lokatorów w postaci linka.
2. Właściciel konfiguruje swoje mieszkanie – wypełnia adres mieszkania, informacje o tym jakie media są w nim dostępne, czy ceny za nie są ustalone z góry / na podstawie licznika, do kiedy powinny być płacone rachunki itp.
3. Comiesięcznie system na podstawie konfiguracji mieszkania wysyła powiadomienia do lokatorów/właściciela o uzupełnienie odpowiednich informacji np. stanu licznika lub rachunku od operatora medium. Jeśli wszystkie informacje są dostępne, wysyła powiadomienia o możliwości dokonania płatności.
4. Lokator oznacza swój rachunek jako opłacony, dodatkowo właściciel posiada możliwość oznaczenia całego rachunku jako oznaczony. 
5. Jeśli wszyscy lokatorzy opłacą swoje rachunki, rachunek główny zostaje uregulowany i przeniesiony do historii.
6. Jeśli mija termin płatności właściciel mieszkania może wysłać za pomocą aplikacji ponaglenie do lokatora.
7. Właściciel może odpiąć lokatora od mieszkania, wymaga to zaakceptowania przez lokatora. Tak samo lokator może usunąć się z mieszkania, właściciel musi potwierdzić tę akcję. 
8. Każdy użytkownik ma dostęp do historycznych danych mieszkania, do którego jest przypisany - historię rachunków, daty płatności, historyczne stany liczników itp.
9. Właściciel może edytować dane mieszkania.
10. Właściciel lub lokator (w zależności od konfiguracji mieszkania) mogą edytować informacje bieżącego rachunku, dopóki nie zostanie on opłacony np. aktualny stan licznika, rachunek za internet.

## Skład zespołu projektowego
1. Maja Chłodnicka – 204606 – KrDUIs2011Is (lider projektu)
2. Filip Tańcula– 181929 – KrDUIs2012Is
3. Kamil Pietrucha – 181368 – KrDUIs2012Is

## Link do Trello
https://trello.com/b/4n35Erl0/houselock

## Prototyp projektu
<img src="https://github.com/Chlodnicka/houselock/blob/master/www/prototype/Dashboard.jpg" alt="Prototype" width="240" height="500"  />

## Raport wykonanych prac

| Zadanie | Osoba/y, która wykonywała | Czas pracy |
| :---         |     :---:      |          ---: |
| Implementacja API   | Maja Chłodnicka     | 25    |
| Wykonanie prototypu aplikacji     | Kamil Pietrucha       | 4      |
| Wykonanie makiet     | Filip Tańcula       | 5     |
| Początkowa konfiguracja projektu aplikacji (framework Onsen)     | Maja Chłodnicka       | 4      |
| Integracja makiet do struktury plików aplikacji     | Filip Tańcula       | 2      |
| Autoryzacja i wylogowanie użytkownika aplikacji mobilnej     | Maja Chłodnicka       | 3      |
| Wyświetlanie i edycja danych użytkownika     | Maja Chłodnicka       |  2     |
| Wyświetlanie listy mieszkań     | Maja Chłodnicka       | 1,5      |
| Dodawanie nowego mieszkania     | Filip Tańcula       | 3      |
| Wyświetlanie informacji o mieszkaniu     | Filip Tańcula, Kamil Pietrucha       | 3, 2      |
| Testowanie  | Kamil Pietrucha   | 2   |
| Edycja mieszkania     | Filip Tańcula       | 5      |
| Usuwanie mieszkania     | Maja Chłodnicka       | 1      |
| Lista lokatorów     | Maja Chłodnicka       | 2      |
| Zaakceptowanie lub odrzucenie zaproszenie do mieszkania przez lokatora     | Maja Chłodnicka       | 3      |
| Wyświetlnie informacji o rachunku     | Maja Chłodnicka       | 2      |
| Edycja rachunku (wprowadzanie danych, zmiany stanu rachunku)     | Maja Chłodnicka       | 4      |
| Wyświetlanie listy rachunków     | Maja Chłodnicka       | 2      |
| Mechanizm alertów     | Maja Chłodnicka       | 3      |
| Testy     | Filip Tańcula       | 3      |
| Dodawanie i usuwanie lokatorów |  Maja Chłodnicka | 3
| Implementacja bootstrapa | Kamil Pietrucha | 1
| Dodawanie i edytowanie przycisków | Kamil Pietrucha | 2
| Projektowanie i programowanie wyglądu aplikacji | Kamil Pietrucha | 6


### Bilans dla każdego z członków zespołu

| Osoba | Czas pracy |
| :---         |         ---: |
| Maja Chłodnicka     | 56    |
| Filip Tańcula       | 21     |
| Kamil Pietrucha     | 17     |


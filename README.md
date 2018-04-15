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





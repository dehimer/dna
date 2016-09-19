# dna
Part of an application.

Инструкция:

1. Распаковка
	npm install
2. Настройка
	скопировать файл config/config.js.example в config/config.js и настроить под себя
3. Сборка
	npm run build
4. Запуск
	node server/run.js

Настройки:
	targethost - адрес сервера, который будет получать новые ответы
	waittargethost - флаг, указывающий, нужно ли менять статус ответов на "отправленный"
		без подтверждения от targethost
	admin_password - пароль страницы администратора
	question - вопрос, который будет задаваться посетителям
	showtwitch - показывать или нет видеопоток после ответа	
	twitchchannel - канал, поток которого будет выводиться 
}


Пользователь передаёт ответы через обычный GET
Администратор синхронизирован с базой через socket.io

<pre>
* TODO

	1.	a bootstrap
	2.	gradient background
	3.	файл с параметрами
			адрес сервера для ответов
			пароль администратора
			ссылка на twitch трансляцию
	4.	подключить шрифты
	5.	форма ввода ответа
			получение вопроса для вывода
			вывод формы
				вывода вопроса
				вывод поля ввода ответы
		правки #1
			перевести на табличный вид
			скрытие отображение частей
		правки #2
			отграничить ввод 30ю символами
	6.	вывод благодарности за ответ
		правки
			привести к виду из макета
	7. 	вывести логотип
?	8.	переход на трансляцию после ответа
			ошибка авторизации. наверно нужно иметь аккаунт в twitch
	9.	сокетное соединение между клиентом и сервером
	10.	форма ввода пароля на странице администратора
	11.	авторизация администратора
	12.	поднять базу nedb
	13.	получение ответов от клиента
	14.	сохранение ответов в базе
	15.	вывод ответов в табличном виде
	16.	вывод кнопки отправить
	17.	обработка нажатия на клиенте
	18. добавление новых строк таблицы при появление на сервере
	19. отправка ответа на целевой сервер
	20. пузырьчатый фон
</pre>
run:
	docker-compose up --build -d

stop:
	docker-compose stop
	docker-compose down -v
	rm -rf angular/.angular

clean:
	docker system prune -af

fclean : stop clean

re: fclean run

.PHONY: run stop clean re
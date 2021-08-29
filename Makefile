git:
	git add .
	git commit -m "update"
	git push

deploy:
	rm -r .next
	yarn install
	yarn build
	yarn start
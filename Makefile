git:
	git add .
	git commit -m "update"
	git push

deploy:
	yarn install
	yarn build
	yarn start
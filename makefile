backup:
	mkdir -p f4dump
	ssh local@studyplan.f4.htw-berlin.de mongodump && scp -r local@studyplan.f4.htw-berlin.de:/home/local/dump f4dump/$(shell date +%Y-%m-%d_%H-%M-%S)

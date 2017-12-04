var vsFilterList = [
	{ "filename": "Doctor_Who_S03_E01_The_Runaway_Bride.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=200257859&episodeId=70110266"},
	{ "filename": "Doctor_Who_S03_E02_Smith_and_Jones.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=13589538&episodeId=70110253"},
	{ "filename": "Doctor_Who_S03_E03_The_Shakespear_Code.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=13589538&episodeId=70110254"},
	{ "filename": "Doctor_Who_S03_E04_Gridlock.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=13589538&episodeId=70110255"},
	{ "filename": "Doctor_Who_S04_E01_The_Voyage_of_the_Danged.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174742&trkid=13462100&tctx=-99%2C-99%2Cc98b60ee-adbf-4840-a8d9-9eb3d73e4389-331307#episodeId=70158979&trackId=200257859"},
	{ "filename": "Doctor_Who_S04_E02_Partners_in_Crime.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174742&trkid=13462100&tctx=-99%2C-99%2Cc98b60ee-adbf-4840-a8d9-9eb3d73e4389-331307#trackId=13589538&episodeId=70128883"},
	{ "filename": "Doctor_Who_S04_E03_The_Fires_of_Pompeii.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174742&trkid=13462100&tctx=-99%2C-99%2Cc98b60ee-adbf-4840-a8d9-9eb3d73e4389-331307#trackId=13589538&episodeId=70128884"},
	{ "filename": "Doctor_Who_S04_E04_Planet_of_the_Ood.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174742&trkid=13462100&tctx=-99%2C-99%2Cc98b60ee-adbf-4840-a8d9-9eb3d73e4389-331307#trackId=13589538&episodeId=70128885"},
	{ "filename": "Doctor_Who_S04_E05_The_Sontaran_Stratagem.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174742&trkid=13462100&tctx=-99%2C-99%2Cc98b60ee-adbf-4840-a8d9-9eb3d73e4389-331307#trackId=13589538&episodeId=70128886"},
	{ "filename": "Doctor_Who_S04_E06_The_Poison_Sky.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174742&trkid=13462100&tctx=-99%2C-99%2Cc98b60ee-adbf-4840-a8d9-9eb3d73e4389-331307#trackId=13589538&episodeId=70128887"},
	{ "filename": "Doctor_Who_S04_E07_The_Doctors_Daughter.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833"},
	{ "filename": "Doctor_Who_S04_E08_The_Unicorn_and_the_Wasp.json", "pageURL":"http://www.netflix.com/WiPlayer?movieid=70128889&trkid=13462100&tctx=-99%2C…9-f200-4764-95c2-f4854c3634d2-2271713#trackId=200257859&episodeId=70128889"},
	{ "filename": "Doctor_Who_S04_E09_Silence_in_the_Library.json", "pageURL":"http://www.netflix.com/WiPlayer?movieid=70128889&trkid=13462100&tctx=-99%2C-99%2C46384eeb-1dd0-4f36-af7c-fb1daebcfcff-54003177#episodeId=70128890&trackId=200257859"},
	{ "filename": "Doctor_Who_S04_E10_Forest_of_the_Dead.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128892&trkid=13462100&tctx=-99%2C-99%2C3ca294ed-db0f-4358-b9eb-4605ef303642-19662575#episodeId=70128891&trackId=200257859"},
	{ "filename": "Doctor_Who_S04_E11_Midnight.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128892&trkid=13462100&tctx=-99%2C-99%2C3ca294ed-db0f-4358-b9eb-4605ef303642-19662575#trackId=13589538&episodeId=70128892"},
	{ "filename": "Doctor_Who_S04_E12_Turn_Left.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128892&trkid=13462100&tctx=-99%2C-99%2C3ca294ed-db0f-4358-b9eb-4605ef303642-19662575#trackId=13589538&episodeId=70128893"},
	{ "filename": "Doctor_Who_S04_E13_The_Stolen_Earth.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128892&trkid=13462100&tctx=-99%2C-99%2C3ca294ed-db0f-4358-b9eb-4605ef303642-19662575#trackId=13589538&episodeId=70128894"},
	{ "filename": "Doctor_Who_S04_E14_Journeys_End.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128895&trkid=13462100&tctx=-99%2C-99%2C6a269740-e665-4d0a-89d6-8c76824834cc-40119141#trackId=200257859&episodeId=70128895"},
	{ "filename": "Doctor_Who_S04_E15_The_Next_Doctor.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128895&trkid=13462100&tctx=-99%2C-99%2C6a269740-e665-4d0a-89d6-8c76824834cc-40119141#trackId=13589538&episodeId=70158978"},
	{ "filename": "Doctor_Who_S04_E16_Planet_of_the_Dead.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128895&trkid=13462100&tctx=-99%2C-99%2C6a269740-e665-4d0a-89d6-8c76824834cc-40119141#trackId=13589538&episodeId=70267270"},
	{ "filename": "Doctor_Who_S04_E17_The_Waters_of_Mars.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128895&trkid=13462100&tctx=-99%2C-99%2C6a269740-e665-4d0a-89d6-8c76824834cc-40119141#trackId=13589538&episodeId=70267208"},
	{ "filename": "Doctor_Who_S04_E18_The_End_of_Time_Part_1.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128895&trkid=13462100&tctx=-99%2C-99%2C6a269740-e665-4d0a-89d6-8c76824834cc-40119141#trackId=13589538&episodeId=70150477"},
	{ "filename": "Doctor_Who_S04_E19_The_End_of_Time_Part_2.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128895&trkid=13462100&tctx=-99%2C-99%2C6a269740-e665-4d0a-89d6-8c76824834cc-40119141#trackId=13589538&episodeId=70150478"},
	{ "filename": "Doctor_Who_S05_E01_The_Eleventh_Hour.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=200257859&episodeId=70174742"},
	{ "filename": "Doctor_Who_S05_E02_The_Beast_Below.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=13589538&episodeId=70174743"},
	{ "filename": "Doctor_Who_S05_E03_Victory_of_the_Daleks.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=13589538&episodeId=70174744"},
	{ "filename": "Doctor_Who_S05_E04_A_Christmas_Carol.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174750&trkid=13462100&tctx=-99%2C-99%2Cf0a451e0-4529-4f9c-b2ff-a6804211de15-7802279#trackId=13589538&episodeId=70207881"},
	{ "filename": "Doctor_Who_S05_E04_The_Time_of_Angels.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=13589538&episodeId=70174745"},
	{ "filename": "Doctor_Who_S05_E05_Flesh_and_Blood.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=13589538&episodeId=70174746"},
	{ "filename": "Doctor_Who_S05_E06_The_Vampires_of_Venice.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=13589538&episodeId=70174747"},
	{ "filename": "Doctor_Who_S05_E07_Amys_Choice.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=13589538&episodeId=70174748"},
	{ "filename": "Doctor_Who_S05_E08_The_Hungry_Earth.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70128888&trkid=13462100&tctx=-99%2C-99%2C20e4acc5-7303-4f8b-ba4e-80d17aa7c6fe-50572833#trackId=13589538&episodeId=70174749"},
	{ "filename": "Doctor_Who_S05_E09_Cold_Blood.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174750&trkid=13462100&tctx=-99%2C-99%2Cf0a451e0-4529-4f9c-b2ff-a6804211de15-7802279"},
	{ "filename": "Doctor_Who_S05_E10_Vincent_and_the_Doctor.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174750&trkid=13462100&tctx=-99%2C-99%2Cf0a451e0-4529-4f9c-b2ff-a6804211de15-7802279#episodeId=70174751&trackId=13589538"},
	{ "filename": "Doctor_Who_S05_E11_The_Lodger.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174750&trkid=13462100&tctx=-99%2C-99%2Cf0a451e0-4529-4f9c-b2ff-a6804211de15-7802279#trackId=13589538&episodeId=70174752"},
	{ "filename": "Doctor_Who_S05_E12_The_Pandorica_Opens.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174750&trkid=13462100&tctx=-99%2C-99%2Cf0a451e0-4529-4f9c-b2ff-a6804211de15-7802279#trackId=13589538&episodeId=70174753"},
	{ "filename": "Doctor_Who_S05_E13_The_Big_Bang.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174750&trkid=13462100&tctx=-99%2C-99%2Cf0a451e0-4529-4f9c-b2ff-a6804211de15-7802279#trackId=13589538&episodeId=70174754"},
	{ "filename": "Doctor_Who_S06_E01_The_Impossible_Astronaut.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174750&trkid=13462100&tctx=-99%2C-99%2Cf0a451e0-4529-4f9c-b2ff-a6804211de15-7802279#trackId=200257859&episodeId=70228327"},
	{ "filename": "Doctor_Who_S06_E02_Day_of_the_Moon.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174750&trkid=13462100&tctx=-99%2C-99%2Cf0a451e0-4529-4f9c-b2ff-a6804211de15-7802279#trackId=13589538&episodeId=70228328"},
	{ "filename": "Doctor_Who_S06_E03_The_Curse_of_the_Black_Spot.json", "pageURL": "http://www.netflix.com/WiPlayer?movieid=70174750&trkid=13462100&tctx=-99%2C-99%2Cf0a451e0-4529-4f9c-b2ff-a6804211de15-7802279#trackId=13589538&episodeId=70228329"},
	{ "filename": "Doctor_Who_S8:_E13_Last_Christmas", "pageURL": "http://www.netflix.com/watch/80007244?trackId=200257859" }
];
// Al-Haqq — shared entry rendering engine
// Ports the database.html reading pipeline (verse/bible linking, TTS reader,
// clip cards, interactive-entry components) for use from the celestial hub.

const entries = window.ALHAQQ_ENTRIES;

const verseDB = {
  "53:32": { arabic: "هُوَ أَعْلَمُ بِكُمْ إِذْ أَنشَأَكُم مِّنَ الْأَرْضِ وَإِذْ أَنتُمْ أَجِنَّةٌ فِي بُطُونِ أُمَّهَاتِكُمْ", translation: "He knows you best, since He produced you from the earth and when you were embryos in your mothers' wombs.", ref: "Surah An-Najm 53:32" },
  "26:59": { arabic: "كَذَٰلِكَ وَأَوْرَثْنَٰهَا بَنِىٓ إِسْرَٰٓءِيلَ", translation: "Thus. And We caused to inherit it the Children of Israel.", ref: "Surah Ash-Shu'ara 26:59. The verse the whole argument rests on. The object is the gardens, springs, treasures and station listed in the two verses before it. The word Egypt does not appear." },
  "33:27": { arabic: "وَأَوْرَثَكُمْ أَرْضَهُمْ وَدِيَٰرَهُمْ وَأَمْوَٰلَهُمْ وَأَرْضًۭا لَّمْ تَطَـُٔوهَا ۚ وَكَانَ ٱللَّهُ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرًۭا", translation: "And He caused you to inherit their land and their homes and their properties and a land which you have not trodden. And ever is Allah, over all things, competent.", ref: "Surah Al-Ahzab 33:27. This is how the Quran writes territorial inheritance. Land, homes, properties, untrodden land. Compare the object list in 26:58 and the difference is the entire case." },
  "5:21": { arabic: "يَٰقَوْمِ ٱدْخُلُوا۟ ٱلْأَرْضَ ٱلْمُقَدَّسَةَ ٱلَّتِى كَتَبَ ٱللَّهُ لَكُمْ وَلَا تَرْتَدُّوا۟ عَلَىٰٓ أَدْبَارِكُمْ فَتَنقَلِبُوا۟ خَٰسِرِينَ", translation: "O my people, enter the Holy Land which Allah has assigned to you and do not turn back and thus become losers.", ref: "Surah Al-Ma'idah 5:21. The Holy Land is a place they must enter, which means they are standing outside it." },
  "5:22": { arabic: "قَالُوا۟ يَٰمُوسَىٰٓ إِنَّ فِيهَا قَوْمًۭا جَبَّارِينَ وَإِنَّا لَن نَّدْخُلَهَا حَتَّىٰ يَخْرُجُوا۟ مِنْهَا فَإِن يَخْرُجُوا۟ مِنْهَا فَإِنَّا دَٰخِلُونَ", translation: "They said, O Moses, indeed within it is a people of tyrannical strength, and indeed, we will never enter it until they leave it; but if they leave it, then we will enter.", ref: "Surah Al-Ma'idah 5:22. A strong people already occupy it and have to leave first. Egypt had no such population left after Pharaoh drowned." },
  "5:26": { arabic: "قَالَ فَإِنَّهَا مُحَرَّمَةٌ عَلَيْهِمْ ۛ أَرْبَعِينَ سَنَةًۭ ۛ يَتِيهُونَ فِى ٱلْأَرْضِ ۚ فَلَا تَأْسَ عَلَى ٱلْقَوْمِ ٱلْفَٰسِقِينَ", translation: "Allah said, Then indeed, it is forbidden to them for forty years in which they will wander throughout the land. So do not grieve over the defiantly disobedient people.", ref: "Surah Al-Ma'idah 5:26. Forty years of wandering for refusing. This is Numbers 13 and 14 in the Quran's own words." },
  "28:5": { arabic: "وَنُرِيدُ أَن نَّمُنَّ عَلَى ٱلَّذِينَ ٱسْتُضْعِفُوا۟ فِى ٱلْأَرْضِ وَنَجْعَلَهُمْ أَئِمَّةًۭ وَنَجْعَلَهُمُ ٱلْوَٰرِثِينَ", translation: "And We wanted to confer favor upon those who were oppressed in the land and make them leaders and make them inheritors", ref: "Surah Al-Qasas 28:5. Opens with We intended that. Everything after is a list of intentions, not a timeline." },
  "28:6": { arabic: "وَنُمَكِّنَ لَهُمْ فِى ٱلْأَرْضِ وَنُرِىَ فِرْعَوْنَ وَهَٰمَٰنَ وَجُنُودَهُمَا مِنْهُم مَّا كَانُوا۟ يَحْذَرُونَ", translation: "And establish them in the land and show Pharaoh and Haman and their soldiers through them that which they had feared.", ref: "Surah Al-Qasas 28:6. Establish them and show Pharaoh what he feared. What he feared is named in 7:127." },
  "28:58": { arabic: "وَكَمْ أَهْلَكْنَا مِن قَرْيَةٍۭ بَطِرَتْ مَعِيشَتَهَا ۖ فَتِلْكَ مَسَٰكِنُهُمْ لَمْ تُسْكَن مِّنۢ بَعْدِهِمْ إِلَّا قَلِيلًۭا ۖ وَكُنَّا نَحْنُ ٱلْوَٰرِثِينَ", translation: "And how many a city have We destroyed that was insolent in its way of living, and those are their dwellings which have not been inhabited after them except briefly. And it is We who were the inheritors.", ref: "Surah Al-Qasas 28:58. Same surah. Their dwellings were not lived in after them, and Allah is the inheritor. Inheritance here requires nobody to move in." },
  "43:51": { arabic: "وَنَادَىٰ فِرْعَوْنُ فِى قَوْمِهِۦ قَالَ يَٰقَوْمِ أَلَيْسَ لِى مُلْكُ مِصْرَ وَهَٰذِهِ ٱلْأَنْهَٰرُ تَجْرِى مِن تَحْتِىٓ ۖ أَفَلَا تُبْصِرُونَ", translation: "And Pharaoh called out among his people; he said, O my people, does not the kingdom of Egypt belong to me, and these rivers flowing beneath me; then do you not see?", ref: "Surah Az-Zukhruf 43:51. Pharaoh says kingdom of Egypt. The Quran has the phrase and never transfers it to the Children of Israel." },
  "26:17": { arabic: "أَنْ أَرْسِلْ مَعَنَا بَنِىٓ إِسْرَٰٓءِيلَ", translation: "Send with us the Children of Israel.", ref: "Surah Ash-Shu'ara 26:17. Moses to Pharaoh. Send with us the Children of Israel. This is let my people go." },
  "20:47": { arabic: "فَأْتِيَاهُ فَقُولَآ إِنَّا رَسُولَا رَبِّكَ فَأَرْسِلْ مَعَنَا بَنِىٓ إِسْرَٰٓءِيلَ وَلَا تُعَذِّبْهُمْ ۖ قَدْ جِئْنَٰكَ بِـَٔايَةٍۢ مِّن رَّبِّكَ ۖ وَٱلسَّلَٰمُ عَلَىٰ مَنِ ٱتَّبَعَ ٱلْهُدَىٰٓ", translation: "So go to him and say, Indeed, we are messengers of your Lord, so send with us the Children of Israel and do not torment them. We have come to you with a sign from your Lord. And peace will be upon he who follows the guidance.", ref: "Surah Ta-Ha 20:47. The same demand again, with do not torment them attached." },
  "21:71": { arabic: "وَنَجَّيْنَٰهُ وَلُوطًا إِلَى ٱلْأَرْضِ ٱلَّتِى بَٰرَكْنَا فِيهَا لِلْعَٰلَمِينَ", translation: "And We delivered him and Lot to the land which We had blessed for the worlds.", ref: "Surah Al-Anbiya 21:71. The blessed land is where Abraham and Lot were delivered. Genesis 12 and Genesis 13 tell you where that is." },
  "7:137": { arabic: "وَأَوْرَثْنَا ٱلْقَوْمَ ٱلَّذِينَ كَانُوا۟ يُسْتَضْعَفُونَ مَشَٰرِقَ ٱلْأَرْضِ وَمَغَٰرِبَهَا ٱلَّتِى بَٰرَكْنَا فِيهَا ۖ وَتَمَّتْ كَلِمَتُ رَبِّكَ ٱلْحُسْنَىٰ عَلَىٰ بَنِىٓ إِسْرَٰٓءِيلَ بِمَا صَبَرُوا۟ ۖ وَدَمَّرْنَا مَا كَانَ يَصْنَعُ فِرْعَوْنُ وَقَوْمُهُۥ وَمَا كَانُوا۟ يَعْرِشُونَ", translation: "And We caused the people who had been oppressed to inherit the eastern regions of the land and the western ones, which We had blessed. And the good word of your Lord was fulfilled for the Children of Israel because of what they had patiently endured. And We destroyed all that Pharaoh and his people were producing and what they had been building.", ref: "Surah Al-A'raf 7:137. The inheritance of the blessed land. Read with 21:71 it cannot be Egypt." },
  "7:127": { arabic: "وَقَالَ ٱلْمَلَأُ مِن قَوْمِ فِرْعَوْنَ أَتَذَرُ مُوسَىٰ وَقَوْمَهُۥ لِيُفْسِدُوا۟ فِى ٱلْأَرْضِ وَيَذَرَكَ وَءَالِهَتَكَ ۚ قَالَ سَنُقَتِّلُ أَبْنَآءَهُمْ وَنَسْتَحْىِۦ نِسَآءَهُمْ وَإِنَّا فَوْقَهُمْ قَٰهِرُونَ", translation: "And the eminent among the people of Pharaoh said, Will you leave Moses and his people to cause corruption in the land and abandon you and your gods? Pharaoh said, We will kill their sons and keep their women alive; and indeed, we are subjugators over them.", ref: "Surah Al-A'raf 7:127. What Pharaoh actually feared. Losing Moses and his people, and being abandoned along with his gods." },
  "26:52": { arabic: "۞ وَأَوْحَيْنَآ إِلَىٰ مُوسَىٰٓ أَنْ أَسْرِ بِعِبَادِىٓ إِنَّكُم مُّتَّبَعُونَ", translation: "And We inspired to Moses, Travel by night with My servants; indeed, you will be pursued.", ref: "Surah Ash-Shu'ara 26:52. Travel by night with My servants. The departure the argument claims the Quran does not contain." },
  "6:34": { arabic: "وَلَقَدْ كُذِّبَتْ رُسُلٌۭ مِّن قَبْلِكَ فَصَبَرُوا۟ عَلَىٰ مَا كُذِّبُوا۟ وَأُوذُوا۟ حَتَّىٰٓ أَتَىٰهُمْ نَصْرُنَا ۚ وَلَا مُبَدِّلَ لِكَلِمَٰتِ ٱللَّهِ ۚ وَلَقَدْ جَآءَكَ مِن نَّبَإِى۟ ٱلْمُرْسَلِينَ", translation: "And certainly were messengers denied before you, but they were patient over [the effects of] denial, and they were harmed until Our victory came to them. And none can alter the words of Allah. And there has certainly come to you some information about the [previous] messengers.", ref: "Surah Al-An'am 6:34. The unchangeable word is the help arriving in the same sentence." },
  "6:115": { arabic: "وَتَمَّتْ كَلِمَتُ رَبِّكَ صِدْقًۭا وَعَدْلًۭا ۚ لَّا مُبَدِّلَ لِكَلِمَٰتِهِۦ ۚ وَهُوَ ٱلسَّمِيعُ ٱلْعَلِيمُ", translation: "And the word of your Lord has been fulfilled in truth and in justice. None can alter His words, and He is the Hearing, the Knowing.", ref: "Surah Al-An'am 6:115. Read 6:114 first: the Book of this passage is the one sent down to you, fully detailed." },
  "10:64": { arabic: "لَهُمُ ٱلْبُشْرَىٰ فِى ٱلْحَيَوٰةِ ٱلدُّنْيَا وَفِى ٱلْءَاخِرَةِ ۚ لَا تَبْدِيلَ لِكَلِمَٰتِ ٱللَّهِ ۚ ذَٰلِكَ هُوَ ٱلْفَوْزُ ٱلْعَظِيمُ", translation: "For them are good tidings in the worldly life and in the Hereafter. No change is there in the words of Allah. That is what is the great attainment.", ref: "Surah Yunus 10:64. The words are the good news promised to the allies of Allah, named two verses earlier." },
  "18:27": { arabic: "وَٱتْلُ مَآ أُوحِىَ إِلَيْكَ مِن كِتَابِ رَبِّكَ ۖ لَا مُبَدِّلَ لِكَلِمَٰتِهِۦ وَلَن تَجِدَ مِن دُونِهِۦ مُلْتَحَدًۭا", translation: "And recite, [O Muhammad], what has been revealed to you of the Book of your Lord. There is no changer of His words, and never will you find in other than Him a refuge.", ref: "Surah Al-Kahf 18:27. Revealed to you: the Book being recited is the Quran." },
  "48:15": { arabic: "سَيَقُولُ ٱلْمُخَلَّفُونَ إِذَا ٱنطَلَقْتُمْ إِلَىٰ مَغَانِمَ لِتَأْخُذُوهَا ذَرُونَا نَتَّبِعْكُمْ ۖ يُرِيدُونَ أَن يُبَدِّلُوا۟ كَلَٰمَ ٱللَّهِ ۚ قُل لَّن تَتَّبِعُونَا كَذَٰلِكُمْ قَالَ ٱللَّهُ مِن قَبْلُ ۖ فَسَيَقُولُونَ بَلْ تَحْسُدُونَنَا ۚ بَلْ كَانُوا۟ لَا يَفْقَهُونَ إِلَّا قَلِيلًۭا", translation: "Those who remained behind will say when you set out toward the war booty to take it, \"Let us follow you.\" They wish to change the words of Allah. Say, \"Never will you follow us. Thus did Allah say before.\" So they will say, \"Rather, you envy us.\" But [in fact] they were not understanding except a little.", ref: "Surah Al-Fath 48:15. The speech is the ruling Allah already gave about the expedition." },
  "33:62": { arabic: "سُنَّةَ ٱللَّهِ فِى ٱلَّذِينَ خَلَوْا۟ مِن قَبْلُ ۖ وَلَن تَجِدَ لِسُنَّةِ ٱللَّهِ تَبْدِيلًۭا", translation: "[This is] the established way of Allah with those who passed on before; and you will not find in the way of Allah any change.", ref: "Surah Al-Ahzab 33:62" },
  "2:58": { arabic: "وَإِذْ قُلْنَا ٱدْخُلُوا۟ هَٰذِهِ ٱلْقَرْيَةَ فَكُلُوا۟ مِنْهَا حَيْثُ شِئْتُمْ رَغَدًۭا وَٱدْخُلُوا۟ ٱلْبَابَ سُجَّدًۭا وَقُولُوا۟ حِطَّةٌۭ نَّغْفِرْ لَكُمْ خَطَٰيَٰكُمْ ۚ وَسَنَزِيدُ ٱلْمُحْسِنِينَ", translation: "And [recall] when We said, \"Enter this city and eat from it wherever you will in [ease and] abundance, and enter the gate bowing humbly and say, 'Relieve us of our burdens.' We will [then] forgive your sins for you, and We will increase the doers of good [in goodness and reward].\"", ref: "Surah Al-Baqarah 2:58. The commanded word, one verse before the swap." },
  "2:59": { arabic: "فَبَدَّلَ ٱلَّذِينَ ظَلَمُوا۟ قَوْلًا غَيْرَ ٱلَّذِى قِيلَ لَهُمْ فَأَنزَلْنَا عَلَى ٱلَّذِينَ ظَلَمُوا۟ رِجْزًۭا مِّنَ ٱلسَّمَآءِ بِمَا كَانُوا۟ يَفْسُقُونَ", translation: "But those who wronged changed [those words] to a statement other than that which had been said to them, so We sent down upon those who wronged a punishment from the sky because they were defiantly disobeying.", ref: "Surah Al-Baqarah 2:59. The verb is baddala, the same root as la mubaddila." },
  "2:78": { arabic: "وَمِنْهُمْ أُمِّيُّونَ لَا يَعْلَمُونَ ٱلْكِتَٰبَ إِلَّآ أَمَانِىَّ وَإِنْ هُمْ إِلَّا يَظُنُّونَ", translation: "And among them are unlettered ones who do not know the Scripture except in wishful thinking, but they are only assuming.", ref: "Surah Al-Baqarah 2:78. The customers, one verse before the forgers." },
  "5:12": { arabic: "۞ وَلَقَدْ أَخَذَ ٱللَّهُ مِيثَٰقَ بَنِىٓ إِسْرَٰٓءِيلَ وَبَعَثْنَا مِنْهُمُ ٱثْنَىْ عَشَرَ نَقِيبًۭا ۖ وَقَالَ ٱللَّهُ إِنِّى مَعَكُمْ ۖ لَئِنْ أَقَمْتُمُ ٱلصَّلَوٰةَ وَءَاتَيْتُمُ ٱلزَّكَوٰةَ وَءَامَنتُم بِرُسُلِى وَعَزَّرْتُمُوهُمْ وَأَقْرَضْتُمُ ٱللَّهَ قَرْضًا حَسَنًۭا لَّأُكَفِّرَنَّ عَنكُمْ سَيِّـَٔاتِكُمْ وَلَأُدْخِلَنَّكُمْ جَنَّٰتٍۢ تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ ۚ فَمَن كَفَرَ بَعْدَ ذَٰلِكَ مِنكُمْ فَقَدْ ضَلَّ سَوَآءَ ٱلسَّبِيلِ", translation: "And Allah had already taken a covenant from the Children of Israel, and We delegated from among them twelve leaders. And Allah said, \"I am with you. If you establish prayer and give zakah and believe in My messengers and support them and loan Allah a goodly loan, I will surely remove from you your misdeeds and admit you to gardens beneath which rivers flow. But whoever of you disbelieves after that has certainly strayed from the soundness of the way.\"", ref: "Surah Al-Ma'idah 5:12. Names whose covenant 5:13 is talking about." },
  "5:110": { arabic: "إِذْ قَالَ ٱللَّهُ يَٰعِيسَى ٱبْنَ مَرْيَمَ ٱذْكُرْ نِعْمَتِى عَلَيْكَ وَعَلَىٰ وَٰلِدَتِكَ إِذْ أَيَّدتُّكَ بِرُوحِ ٱلْقُدُسِ تُكَلِّمُ ٱلنَّاسَ فِى ٱلْمَهْدِ وَكَهْلًۭا ۖ وَإِذْ عَلَّمْتُكَ ٱلْكِتَٰبَ وَٱلْحِكْمَةَ وَٱلتَّوْرَىٰةَ وَٱلْإِنجِيلَ ۖ وَإِذْ تَخْلُقُ مِنَ ٱلطِّينِ كَهَيْـَٔةِ ٱلطَّيْرِ بِإِذْنِى فَتَنفُخُ فِيهَا فَتَكُونُ طَيْرًۢا بِإِذْنِى ۖ وَتُبْرِئُ ٱلْأَكْمَهَ وَٱلْأَبْرَصَ بِإِذْنِى ۖ وَإِذْ تُخْرِجُ ٱلْمَوْتَىٰ بِإِذْنِى ۖ وَإِذْ كَفَفْتُ بَنِىٓ إِسْرَٰٓءِيلَ عَنكَ إِذْ جِئْتَهُم بِٱلْبَيِّنَٰتِ فَقَالَ ٱلَّذِينَ كَفَرُوا۟ مِنْهُمْ إِنْ هَٰذَآ إِلَّا سِحْرٌۭ مُّبِينٌۭ", translation: "[The Day] when Allah will say, \"O Jesus, Son of Mary, remember My favor upon you and upon your mother when I supported you with the Pure Spirit and you spoke to the people in the cradle and in maturity; and [remember] when I taught you writing and wisdom and the Torah and the Gospel; and when you designed from clay [what was] like the form of a bird with My permission, then you breathed into it, and it became a bird with My permission; and you healed the blind and the leper with My permission; and when you brought forth the dead with My permission; and when I restrained the Children of Israel from [killing] you when you came to them with clear proofs and those who disbelieved among them said, \"This is not but obvious magic.\"", ref: "Surah Al-Ma'idah 5:110. Allah speaking to Jesus directly. Torah and Injil, same clause, same divine teaching." },
  "42:13": { arabic: "۞ شَرَعَ لَكُم مِّنَ ٱلدِّينِ مَا وَصَّىٰ بِهِۦ نُوحًۭا وَٱلَّذِىٓ أَوْحَيْنَآ إِلَيْكَ وَمَا وَصَّيْنَا بِهِۦٓ إِبْرَٰهِيمَ وَمُوسَىٰ وَعِيسَىٰٓ ۖ أَنْ أَقِيمُوا۟ ٱلدِّينَ وَلَا تَتَفَرَّقُوا۟ فِيهِ ۚ كَبُرَ عَلَى ٱلْمُشْرِكِينَ مَا تَدْعُوهُمْ إِلَيْهِ ۚ ٱللَّهُ يَجْتَبِىٓ إِلَيْهِ مَن يَشَآءُ وَيَهْدِىٓ إِلَيْهِ مَن يُنِيبُ", translation: "He has ordained for you of religion what He enjoined upon Noah and that which We have revealed to you, [O Muhammad], and what We enjoined upon Abraham and Moses and Jesus - to establish the religion and not be divided therein. Difficult for those who associate others with Allah is that to which you invite them. Allah chooses for Himself whom He wills and guides to Himself whoever turns back [to Him].", ref: "Surah Ash-Shura 42:13. The delivery chain of the word: prophet to prophet, by revelation." },
  "43:63": { arabic: "وَلَمَّا جَآءَ عِيسَىٰ بِٱلْبَيِّنَٰتِ قَالَ قَدْ جِئْتُكُم بِٱلْحِكْمَةِ وَلِأُبَيِّنَ لَكُم بَعْضَ ٱلَّذِى تَخْتَلِفُونَ فِيهِ ۖ فَٱتَّقُوا۟ ٱللَّهَ وَأَطِيعُونِ", translation: "And when Jesus brought clear proofs, he said, \"I have come to you with wisdom and to make clear to you some of that over which you differ, so fear Allah and obey me.", ref: "Surah Az-Zukhruf 43:63. A clarifier is only sent to a people whose version has drifted." },
  "41:42": { arabic: "لَّا يَأْتِيهِ ٱلْبَٰطِلُ مِنۢ بَيْنِ يَدَيْهِ وَلَا مِنْ خَلْفِهِۦ ۖ تَنزِيلٌۭ مِّنْ حَكِيمٍ حَمِيدٍۢ", translation: "Falsehood cannot approach it from before it or from behind it; [it is] a revelation from a [Lord who is] Wise and Praiseworthy.", ref: "Surah Fussilat 41:42. The Quran's second guard verse, alongside 15:9." },
  "24:2": { arabic: "الزَّانِيَةُ وَالزَّانِي فَاجْلِدُوا كُلَّ وَاحِدٍ مِنْهُمَا مِائَةَ جَلْدَةٍ", translation: "The adulteress and the adulterer, lash each one of them one hundred lashes.", ref: "Surah An-Nur 24:2" },
  "4:25": { arabic: "فَإِذَا أُحْصِنَّ فَإِنْ أَتَيْنَ بِفَاحِشَةٍ فَعَلَيْهِنَّ نِصْفُ مَا عَلَى الْمُحْصَنَاتِ مِنَ الْعَذَابِ", translation: "Then when they are married, if they commit indecency, upon them is half the punishment of free married women.", ref: "Surah An-Nisa 4:25" },
  "75:17": { arabic: "إِنَّ عَلَيْنَا جَمْعَهُ وَقُرْآنَهُ", translation: "Surely upon Us is its collection and its recitation.", ref: "Surah Al-Qiyamah 75:17" },
  "4:137": { arabic: "إِنَّ الَّذِينَ آمَنُوا ثُمَّ كَفَرُوا ثُمَّ آمَنُوا ثُمَّ كَفَرُوا ثُمَّ ازْدَادُوا كُفْرًا لَمْ يَكُنِ اللَّهُ لِيَغْفِرَ لَهُمْ وَلَا لِيَهْدِيَهُمْ سَبِيلًا", translation: "Those who believed, then disbelieved, then believed, then disbelieved, then increased in disbelief: Allah will never forgive them, nor guide them to a way.", ref: "Surah An-Nisa 4:137" },
  "10:99": { arabic: "وَلَوْ شَاءَ رَبُّكَ لَآمَنَ مَنْ فِي الْأَرْضِ كُلُّهُمْ جَمِيعًا ۚ أَفَأَنْتَ تُكْرِهُ النَّاسَ حَتَّىٰ يَكُونُوا مُؤْمِنِينَ", translation: "Had your Lord willed, everyone on earth would have believed, all of them together. Will you then compel the people until they become believers?", ref: "Surah Yunus 10:99" },
  "3:90": { arabic: "إِنَّ الَّذِينَ كَفَرُوا بَعْدَ إِيمَانِهِمْ ثُمَّ ازْدَادُوا كُفْرًا لَنْ تُقْبَلَ تَوْبَتُهُمْ وَأُولَٰئِكَ هُمُ الضَّالُّونَ", translation: "Those who disbelieve after their belief, then increase in disbelief, their repentance will never be accepted. Those are the astray.", ref: "Surah Aal-Imran 3:90" },
  "16:106": { arabic: "مَنْ كَفَرَ بِاللَّهِ مِنْ بَعْدِ إِيمَانِهِ إِلَّا مَنْ أُكْرِهَ وَقَلْبُهُ مُطْمَئِنٌّ بِالْإِيمَانِ وَلَٰكِنْ مَنْ شَرَحَ بِالْكُفْرِ صَدْرًا فَعَلَيْهِمْ غَضَبٌ مِنَ اللَّهِ وَلَهُمْ عَذَابٌ عَظِيمٌ", translation: "Whoever disbelieves in Allah after his belief, except one compelled while his heart rests secure in faith, but whoever opens his chest to disbelief, upon them is wrath from Allah and theirs is a great punishment.", ref: "Surah An-Nahl 16:106" },
  "25:8": { arabic: "وَقَالَ الظَّالِمُونَ إِنْ تَتَّبِعُونَ إِلَّا رَجُلًا مَسْحُورًا", translation: "And the wrongdoers say: you follow none but a man under a spell.", ref: "Surah Al-Furqan 25:8" },
  "17:47": { arabic: "إِذْ يَقُولُ الظَّالِمُونَ إِنْ تَتَّبِعُونَ إِلَّا رَجُلًا مَسْحُورًا", translation: "When the wrongdoers say: you follow none but a man under a spell.", ref: "Surah Al-Isra 17:47" },
  "7:32": { arabic: "قُلْ مَنْ حَرَّمَ زِينَةَ اللَّهِ الَّتِي أَخْرَجَ لِعِبَادِهِ وَالطَّيِّبَاتِ مِنَ الرِّزْقِ", translation: "Say: who has forbidden the adornment of Allah which He brought out for His servants, and the good things of provision?", ref: "Surah Al-A'raf 7:32" },
  "16:116": { arabic: "وَلَا تَقُولُوا لِمَا تَصِفُ أَلْسِنَتُكُمُ الْكَذِبَ هَٰذَا حَلَالٌ وَهَٰذَا حَرَامٌ لِتَفْتَرُوا عَلَى اللَّهِ الْكَذِبَ", translation: "Do not say, about what your tongues falsely describe, this is lawful and this is unlawful, inventing a lie against Allah.", ref: "Surah An-Nahl 16:116" },
  "66:1": { arabic: "يَا أَيُّهَا النَّبِيُّ لِمَ تُحَرِّمُ مَا أَحَلَّ اللَّهُ لَكَ ۖ تَبْتَغِي مَرْضَاتَ أَزْوَاجِكَ", translation: "O Prophet, why do you prohibit what Allah has made lawful for you, seeking the approval of your wives?", ref: "Surah At-Tahrim 66:1" },
  "59:7": { arabic: "وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانْتَهُوا", translation: "And what the Messenger gives you, take it, and what he forbids you, refrain from it.", ref: "Surah Al-Hashr 59:7. The full verse opens with the distribution of war gains. That is the context of what he gives you." },
  "10:15": { arabic: "قُلْ مَا يَكُونُ لِي أَنْ أُبَدِّلَهُ مِنْ تِلْقَاءِ نَفْسِي ۖ إِنْ أَتَّبِعُ إِلَّا مَا يُوحَىٰ إِلَيَّ", translation: "Say: it is not for me to change it of my own accord. I follow only what is revealed to me.", ref: "Surah Yunus 10:15" },
  "7:3": { arabic: "اتَّبِعُوا مَا أُنْزِلَ إِلَيْكُمْ مِنْ رَبِّكُمْ وَلَا تَتَّبِعُوا مِنْ دُونِهِ أَوْلِيَاءَ ۗ قَلِيلًا مَا تَذَكَّرُونَ", translation: "Follow what has been sent down to you from your Lord, and do not follow guardians besides Him. Little do you remember.", ref: "Surah Al-A'raf 7:3" },
  "13:41": { arabic: "وَاللَّهُ يَحْكُمُ لَا مُعَقِّبَ لِحُكْمِهِ", translation: "Allah judges. There is none to revise His judgment.", ref: "Surah Ar-Ra'd 13:41" },
  "67:14": { arabic: "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ", translation: "Does He not know, He who created? And He is the Subtle, the Aware.", ref: "Surah Al-Mulk 67:14" },
  "50:29": { arabic: "مَا يُبَدَّلُ الْقَوْلُ لَدَيَّ وَمَا أَنَا بِظَلَّامٍ لِلْعَبِيدِ", translation: "The word is not changed with Me, and I am never unjust to the servants.", ref: "Surah Qaf 50:29" },
  "17:1": { arabic: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى الَّذِي بَارَكْنَا حَوْلَهُ لِنُرِيَهُ مِنْ آيَاتِنَا", translation: "Glory to Him who took His servant by night from the Sacred Mosque to the Farthest Mosque, whose surroundings We blessed, to show him of Our signs.", ref: "Surah Al-Isra 17:1" },
  "27:44": { arabic: "قَالَتْ رَبِّ إِنِّي ظَلَمْتُ نَفْسِي وَأَسْلَمْتُ مَعَ سُلَيْمَانَ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "She said: My Lord, I have wronged myself, and I submit with Sulayman to Allah, Lord of the worlds.", ref: "Surah An-Naml 27:44" },
  "5:4": { arabic: "وَمَا عَلَّمْتُمْ مِنَ الْجَوَارِحِ مُكَلِّبِينَ تُعَلِّمُونَهُنَّ مِمَّا عَلَّمَكُمُ اللَّهُ ۖ فَكُلُوا مِمَّا أَمْسَكْنَ عَلَيْكُمْ", translation: "And what you have trained of hunting animals, teaching them from what Allah has taught you: eat of what they catch for you.", ref: "Surah Al-Ma'idah 5:4" },
  "18:18": { arabic: "وَكَلْبُهُمْ بَاسِطٌ ذِرَاعَيْهِ بِالْوَصِيدِ", translation: "And their dog stretching its forelegs at the entrance.", ref: "Surah Al-Kahf 18:18" },
  "14:33": { arabic: "وَسَخَّرَ لَكُمُ الشَّمْسَ وَالْقَمَرَ دَائِبَيْنِ", translation: "And He subjected for you the sun and the moon, da'ibayn, constant in their courses.", ref: "Surah Ibrahim 14:33" },
  "36:40": { arabic: "لَا الشَّمْسُ يَنْبَغِي لَهَا أَنْ تُدْرِكَ الْقَمَرَ وَلَا اللَّيْلُ سَابِقُ النَّهَارِ ۚ وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ", translation: "The sun may not overtake the moon, nor does the night outstrip the day. Each swims in an orbit.", ref: "Surah Ya-Sin 36:40" },
  "22:18": { arabic: "أَلَمْ تَرَ أَنَّ اللَّهَ يَسْجُدُ لَهُ مَنْ فِي السَّمَاوَاتِ وَمَنْ فِي الْأَرْضِ وَالشَّمْسُ وَالْقَمَرُ وَالنُّجُومُ", translation: "Do you not see that to Allah prostrates whoever is in the heavens and whoever is on the earth, and the sun, the moon and the stars.", ref: "Surah Al-Hajj 22:18" },
  "21:25": {
    arabic: "وَمَا أَرْسَلْنَا مِن قَبْلِكَ مِن رَّسُولٍ إِلَّا نُوحِي إِلَيْهِ أَنَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدُونِ",
    translation: "We did not send any messenger before you except that We revealed to him: there is no god but I, so worship Me.",
    ref: "Surah Al-Anbiya 21:25"
  },
  "51:56": {
    arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
    translation: "And I did not create the jinn and mankind except to worship Me.",
    ref: "Surah Adh-Dhariyat 51:56. Khalaqtu: first person singular."
  },
  "15:26": {
    arabic: "وَلَقَدْ خَلَقْنَا الْإِنسَانَ مِن صَلْصَالٍ مِّنْ حَمَإٍ مَّسْنُونٍ",
    translation: "And We certainly created man from sounding clay, from altered mud.",
    ref: "Surah Al-Hijr 15:26. Khalaqna: first person plural, same act of creation."
  },
  "20:14": {
    arabic: "إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
    translation: "Indeed, I am Allah. There is no god but I, so worship Me and establish prayer for My remembrance.",
    ref: "Surah Ta-Ha 20:14"
  },
  "2:30": {
    arabic: "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً",
    translation: "And when your Lord said to the angels: Indeed, I am placing upon the earth a successor.",
    ref: "Surah Al-Baqarah 2:30 (opening). Singular 'I', spoken to the angels."
  },
  "2:163": {
    arabic: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ ۖ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ",
    translation: "And your God is one God. There is no god but Him, the Most Compassionate, the Most Merciful.",
    ref: "Surah Al-Baqarah 2:163"
  },
  "23:14": {
    arabic: "فَخَلَقْنَا الْمُضْغَةَ عِظَامًا فَكَسَوْنَا الْعِظَامَ لَحْمًا ثُمَّ أَنشَأْنَاهُ خَلْقًا آخَرَ",
    translation: "And We made the lump into bones, and We clothed the bones with flesh; then We developed him into another creation. So blessed is Allah, the best of creators.",
    ref: "Surah Al-Mu'minun 23:14"
  },
  "2:256": {
    arabic: "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ",
    translation: "There is no compulsion in religion. The right course has become clear from the wrong.",
    ref: "Surah Al-Baqarah 2:256"
  },
  "2:231": {
    arabic: "وَلَا تُمْسِكُوهُنَّ ضِرَارًا لِّتَعْتَدُوا",
    translation: "Do not retain women to harm them, or to transgress against them.",
    ref: "Surah Al-Baqarah 2:231"
  },
  "2:43": {
    arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
    translation: "Establish prayer, give zakah, and bow with those who bow.",
    ref: "Surah Al-Baqarah 2:43"
  },
  "2:79": {
    arabic: "فَوَيْلٌ لِّلَّذِينَ يَكْتُبُونَ الْكِتَابَ بِأَيْدِيهِمْ ثُمَّ يَقُولُونَ هَٰذَا مِنْ عِندِ اللَّهِ لِيَشْتَرُوا بِهِ ثَمَنًا قَلِيلًا",
    translation: "So woe to those who write the Scripture with their own hands, then say, This is from Allah, in order to exchange it for a small price.",
    ref: "Surah Al-Baqarah 2:79"
  },
  "2:80": {
    arabic: "وَقَالُوا۟ لَن تَمَسَّنَا ٱلنَّارُ إِلَّآ أَيَّامًۭا مَّعْدُودَةًۭ ۚ قُلْ أَتَّخَذْتُمْ عِندَ ٱللَّهِ عَهْدًۭا فَلَن يُخْلِفَ ٱللَّهُ عَهْدَهُۥٓ ۖ أَمْ تَقُولُونَ عَلَى ٱللَّهِ مَا لَا تَعْلَمُونَ",
    translation: "And they say: the Fire will not touch us except for a few numbered days. Say: have you taken a covenant from Allah? For Allah never breaks His covenant. Or do you say about Allah what you do not know?",
    ref: "Surah Al-Baqarah 2:80"
  },
  "2:111": {
    arabic: "وَقَالُوا۟ لَن يَدْخُلَ ٱلْجَنَّةَ إِلَّا مَن كَانَ هُودًا أَوْ نَصَٰرَىٰ ۗ تِلْكَ أَمَانِيُّهُمْ ۗ قُلْ هَاتُوا۟ بُرْهَٰنَكُمْ إِن كُنتُمْ صَٰدِقِينَ",
    translation: "And they say: none will enter Paradise except one who is a Jew or a Christian. Those are their wishful claims. Say: bring your proof, if you are truthful.",
    ref: "Surah Al-Baqarah 2:111. The same word as 2:78, amaniyy, aimed at both communities by name."
  },
  "2:238": {
    arabic: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ",
    translation: "Maintain with care the prayers and the middle prayer and stand before Allah, devoutly obedient.",
    ref: "Surah Al-Baqarah 2:238"
  },
  "3:7": {
    arabic: "هُوَ الَّذِي أَنزَلَ عَلَيْكَ الْكِتَابَ مِنْهُ آيَاتٌ مُّحْكَمَاتٌ هُنَّ أُمُّ الْكِتَابِ وَأُخَرُ مُتَشَابِهَاتٌ",
    translation: "It is He who has sent down the Book. In it are verses that are the foundation of the Book and others that are unspecific. Those in whose hearts is deviation follow the unspecific, seeking discord.",
    ref: "Surah Ali Imran 3:7"
  },
  "3:45": {
    arabic: "إِذْ قَالَتِ الْمَلَائِكَةُ يَا مَرْيَمُ إِنَّ اللَّهَ يُبَشِّرُكِ بِكَلِمَةٍ مِّنْهُ اسْمُهُ الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ",
    translation: "The angels said: O Mary, indeed Allah gives you good tidings of a word from Him, whose name will be the Messiah, Jesus son of Mary.",
    ref: "Surah Ali Imran 3:45"
  },
  "3:49": {
    arabic: "أَنِّي قَدْ جِئْتُكُم بِآيَةٍ مِّن رَّبِّكُمْ أَنِّي أَخْلُقُ لَكُم مِّنَ الطِّينِ كَهَيْئَةِ الطَّيْرِ فَأَنفُخُ فِيهِ فَيَكُونُ طَيْرًا بِإِذْنِ اللَّهِ",
    translation: "I have come to you with a sign from your Lord — I create for you from clay the form of a bird, then I breathe into it and it becomes a bird by permission of Allah.",
    ref: "Surah Ali Imran 3:49 — by the permission of Allah. Not independent divine power. Permission. The same framework Peter describes in Acts 2:22."
  },
  "3:50": {
    arabic: "وَمُصَدِّقًا لِّمَا بَيْنَ يَدَيَّ مِنَ التَّوْرَاةِ",
    translation: "And I have come confirming what was before me of the Torah.",
    ref: "Surah Ali Imran 3:50"
  },
  "4:157": {
    arabic: "وَمَا قَتَلُوهُ وَمَا صَلَبُوهُ وَلَٰكِن شُبِّهَ لَهُمْ",
    translation: "And they did not kill him, nor did they crucify him, but it was made to appear so to them.",
    ref: "Surah An-Nisa 4:157"
  },
  "4:171": {
    arabic: "إِنَّمَا الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ رَسُولُ اللَّهِ وَكَلِمَتُهُ وَلَا تَقُولُوا ثَلَاثَةٌ",
    translation: "The Messiah, Jesus son of Mary, was but a messenger of Allah and His word. Do not say Trinity — desist, it is better for you. Indeed Allah is but one God.",
    ref: "Surah An-Nisa 4:171"
  },
  "42:11": {
    arabic: "لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ",
    translation: "There is nothing like unto Him, and He is the Hearing, the Seeing.",
    ref: "Surah Ash-Shura 42:11 — Allah has no comparable form, image, or likeness. Any description using human anatomical terms is metaphorical language for His majesty — not literal anatomy."
  },
  "5:32": {
    arabic: "مَن قَتَلَ نَفْسًا بِغَيْرِ نَفْسٍ أَوْ فَسَادٍ فِي الْأَرْضِ فَكَأَنَّمَا قَتَلَ النَّاسَ جَمِيعًا وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا",
    translation: "Whoever kills a soul unless for a soul or for corruption in the land — it is as if he had slain mankind entirely. And whoever saves one — it is as if he had saved mankind entirely.",
    ref: "Surah Al-Maidah 5:32 — The Quran's foundational statement on human life. Every verse about warfare exists within this moral ceiling."
  },
  "5:48": {
    arabic: "وَأَنزَلْنَا إِلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ مِنَ الْكِتَابِ وَمُهَيْمِنًا عَلَيْهِ",
    translation: "And We have revealed to you the Book in truth, confirming that which preceded it of the Scripture and as a criterion over it.",
    ref: "Surah Al-Ma'idah 5:48"
  },
  "18:22": {
    arabic: "فَلَا تُمَارِ فِيهِمْ إِلَّا مِرَاءً ظَاهِرًا وَلَا تَسْتَفْتِ فِيهِم مِّنْهُمْ أَحَدًا",
    translation: "So do not argue about them except with clear evidence, and do not consult any of them about them.",
    ref: "Surah Al-Kahf 18:22"
  },
  "3:113": {
    arabic: "لَيْسُوا سَوَاءً ۗ مِّنْ أَهْلِ الْكِتَابِ أُمَّةٌ قَائِمَةٌ يَتْلُونَ آيَاتِ اللَّهِ آنَاءَ اللَّيْلِ وَهُمْ يَسْجُدُونَ",
    translation: "They are not all alike. Among the People of the Book is an upright community reciting the verses of Allah through the night, prostrating.",
    ref: "Surah Ali Imran 3:113"
  },
  "12:111": {
    arabic: "لَقَدْ كَانَ فِي قَصَصِهِمْ عِبْرَةٌ لِّأُولِي الْأَلْبَابِ",
    translation: "There was certainly in their stories a lesson for people of understanding.",
    ref: "Surah Yusuf 12:111"
  },
  "46:21": {
    arabic: "وَقَدْ خَلَتِ النُّذُرُ مِن بَيْنِ يَدَيْهِ وَمِنْ خَلْفِهِ",
    translation: "Warners had already passed away before him and after him.",
    ref: "Surah Al-Ahqaf 46:21. The Quran's own usage of bayna yadayhi: temporal precedence, not possession."
  },
  "16:103": {
    arabic: "لِّسَانُ الَّذِي يُلْحِدُونَ إِلَيْهِ أَعْجَمِيٌّ وَهَٰذَا لِسَانٌ عَرَبِيٌّ مُّبِينٌ",
    translation: "The tongue of the one they point to is foreign, while this is a clear Arabic tongue.",
    ref: "Surah An-Nahl 16:103"
  },
  "25:5": {
    arabic: "وَقَالُوا أَسَاطِيرُ الْأَوَّلِينَ اكْتَتَبَهَا فَهِيَ تُمْلَىٰ عَلَيْهِ بُكْرَةً وَأَصِيلًا",
    translation: "They say: tales of the ancients which he has had written down, dictated to him morning and evening.",
    ref: "Surah Al-Furqan 25:5. The borrowing charge, recorded inside the Quran; Allah's answer follows in the next verse."
  },
  "5:47": {
    arabic: "وَلْيَحْكُمْ أَهْلُ الْإِنجِيلِ بِمَا أَنزَلَ اللَّهُ فِيهِ",
    translation: "Let the people of the Injil judge by what Allah revealed within it.",
    ref: "Surah Al-Ma'idah 5:47"
  },
  "2:190": {
    arabic: "وَقَاتِلُوا فِي سَبِيلِ اللَّهِ الَّذِينَ يُقَاتِلُونَكُمْ وَلَا تَعْتَدُوا ۚ إِنَّ اللَّهَ لَا يُحِبُّ الْمُعْتَدِينَ",
    translation: "Fight in the way of Allah those who fight you, but do not transgress. Indeed, Allah does not love the transgressors.",
    ref: "Surah Al-Baqarah 2:190 — Defensive only. Aggression explicitly forbidden."
  },
  "2:194": {
    arabic: "فَمَنِ اعْتَدَىٰ عَلَيْكُمْ فَاعْتَدُوا عَلَيْهِ بِمِثْلِ مَا اعْتَدَىٰ عَلَيْكُمْ",
    translation: "Whoever transgresses against you, transgress against him in the same measure as he transgressed against you.",
    ref: "Surah Al-Baqarah 2:194 — Proportionality. Eye for eye — no more. Escalation is forbidden."
  },
  "2:217": {
    arabic: "وَالْفِتْنَةُ أَشَدُّ مِنَ الْقَتْلِ",
    translation: "And oppression is worse than killing.",
    ref: "Surah Al-Baqarah 2:217 — The Quran ranks oppression as a greater evil than killing itself."
  },
  "8:61": {
    arabic: "وَإِن جَنَحُوا لِلسَّلْمِ فَاجْنَحْ لَهَا وَتَوَكَّلْ عَلَى اللَّهِ",
    translation: "And if they incline to peace, then incline to it also and rely upon Allah.",
    ref: "Surah Al-Anfal 8:61 — If the enemy seeks peace, the Muslim is commanded to accept it. No exceptions."
  },
  "60:8": {
    arabic: "لَّا يَنْهَاكُمُ اللَّهُ عَنِ الَّذِينَ لَمْ يُقَاتِلُوكُمْ فِي الدِّينِ وَلَمْ يُخْرِجُوكُم مِّن دِيَارِكُمْ أَن تَبَرُّوهُمْ وَتُقْسِطُوا إِلَيْهِمْ",
    translation: "Allah does not forbid you from being kind and just towards those who did not fight you because of your religion and did not drive you out of your homes.",
    ref: "Surah Al-Mumtahanah 60:8 — Kindness and justice toward non-combatant non-Muslims is commanded — not just permitted."
  },
  "60:9": {
    arabic: "إِنَّمَا يَنْهَاكُمُ اللَّهُ عَنِ الَّذِينَ قَاتَلُوكُمْ فِي الدِّينِ وَأَخْرَجُوكُم مِّن دِيَارِكُمْ",
    translation: "Allah only forbids you from those who fought you because of religion and expelled you from your homes and supported your expulsion.",
    ref: "Surah Al-Mumtahanah 60:9 — The prohibition applies only to active aggressors — not disbelievers in general."
  },
  "15:9": {
    arabic: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ",
    translation: "Indeed, it is We who sent down the Reminder, and indeed, We will be its guardian.",
    ref: "Surah Al-Hijr 15:9 — Allah's direct promise to preserve the Quran. Carbon-dated manuscripts, 10 million memorizers, and 160 years of non-Muslim scholarship confirm it."
  },
  "1:4": {
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    translation: "Sovereign of the Day of Recompense.",
    ref: "Surah Al-Fatiha 1:4"
  },
  "5:6": {
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ",
    translation: "O you who have believed, when you rise to prayer, wash your faces and your forearms to the elbows, and wipe over your heads, and wash your feet to the ankles.",
    ref: "Surah Al-Ma'idah 5:6"
  },
  "61:6": {
    arabic: "وَإِذْ قَالَ عِيسَى ابْنُ مَرْيَمَ يَا بَنِي إِسْرَائِيلَ إِنِّي رَسُولُ اللَّهِ إِلَيْكُم",
    translation: "And when Jesus son of Mary said: O Children of Israel, I am the messenger of Allah to you.",
    ref: "Surah As-Saf 61:6 — Jesus identifies himself as a messenger of Allah. Consistent with the Synoptic Gospels. Contradicts John's unique divine identity claims."
  },
  "41:34": {
    arabic: "وَلَا تَسْتَوِي الْحَسَنَةُ وَلَا السَّيِّئَةُ ۚ ادْفَعْ بِالَّتِي هِيَا أَحْسَنُ",
    translation: "Good and evil are not equal. Repel evil with that which is better.",
    ref: "Surah Fussilat 41:34 — The Quran actively encourages responding to hostility with goodness."
  },
  "5:3": {
    arabic: "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا",
    translation: "This day I have perfected for you your religion and completed My favour upon you and have approved for you Islam as religion.",
    ref: "Surah Al-Ma'idah 5:3"
  },
  "33:5": {
    arabic: "ادْعُوهُمْ لِآبَائِهِمْ هُوَ أَقْسَطُ عِندَ اللَّهِ ۚ فَإِن لَّمْ تَعْلَمُوا آبَاءَهُمْ فَإِخْوَانُكُمْ فِي الدِّينِ وَمَوَالِيكُمْ",
    translation: "Call them by the names of their fathers; it is more just in the sight of Allah. But if you do not know their fathers, then they are your brothers in religion and those entrusted to you.",
    ref: "Surah Al-Ahzab 33:5"
  },
  "33:37": {
    arabic: "فَلَمَّا قَضَىٰ زَيْدٌ مِّنْهَا وَطَرًا زَوَّجْنَاكَهَا لِكَيْ لَا يَكُونَ عَلَى الْمُؤْمِنِينَ حَرَجٌ فِي أَزْوَاجِ أَدْعِيَائِهِمْ إِذَا قَضَوْا مِنْهُنَّ وَطَرًا",
    translation: "So when Zayd had no longer any need for her, We married her to you, in order that there not be upon the believers any discomfort concerning the wives of their adopted sons when they no longer have need of them.",
    ref: "Surah Al-Ahzab 33:37"
  },
  "33:40": {
    arabic: "مَّا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِّن رِّجَالِكُمْ وَلَٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ",
    translation: "Muhammad is not the father of any of your men, but he is the Messenger of Allah and the seal of the prophets.",
    ref: "Surah Al-Ahzab 33:40"
  },
  "3:144": {
    arabic: "مُّحَمَّدٌ إِلَّا رَسُولٌ قَدْ خَلَتْ مِن قَبْلِهِ الرُّسُلُ",
    translation: "Muhammad is not but a messenger. Other messengers have passed before him.",
    ref: "Surah Ali Imran 3:144"
  },
  "4:2": {
    arabic: "وَآتُوا الْيَتَامَىٰ أَمْوَالَهُمْ ۖ وَلَا تَتَبَدَّلُوا الْخَبِيثَ بِالطَّيِّبِ ۖ وَلَا تَأْكُلُوا أَمْوَالَهُمْ إِلَىٰ أَمْوَالِكُمْ ۚ إِنَّهُ كَانَ حُوبًا كَبِيرًا",
    translation: "And give the orphans their properties and do not substitute the defective for the good, and do not consume their properties into your own. Indeed, that is ever a great sin.",
    ref: "Surah An-Nisa 4:2"
  },
  "4:5": {
    arabic: "وَلَا تُؤْتُوا السُّفَهَاءَ أَمْوَالَكُمُ الَّتِي جَعَلَ اللَّهُ لَكُمْ قِيَامًا",
    translation: "Do not give the mentally immature your wealth which Allah has made a means of support for you.",
    ref: "Surah An-Nisa 4:5"
  },
  "4:10": {
    arabic: "إِنَّ الَّذِينَ يَأْكُلُونَ أَمْوَالَ الْيَتَامَىٰ ظُلْمًا إِنَّمَا يَأْكُلُونَ فِي بُطُونِهِمْ نَارًا ۖ وَسَيَصْلَوْنَ سَعِيرًا",
    translation: "Indeed, those who devour the property of orphans unjustly are only consuming fire into their bellies, and they will be burned in a Blaze.",
    ref: "Surah An-Nisa 4:10"
  },
  "4:6": {
    arabic: "وَابْتَلُوا الْيَتَامَىٰ حَتَّىٰ إِذَا بَلَغُوا النِّكَاحَ فَإِنْ آنَسْتُم مِّنْهُمْ رُشْدًا فَادْفَعُوا إِلَيْهِمْ أَمْوَالَهُمْ",
    translation: "Test the orphans until they reach marriageable age. Then if you perceive in them sound judgement, release their wealth to them.",
    ref: "Surah An-Nisa 4:6"
  },
  "4:82": {
    arabic: "أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ ۚ وَلَوْ كَانَ مِنْ عِندِ غَيْرِ اللَّهِ لَوَجَدُوا فِيهِ اخْتِلَافًا كَثِيرًا",
    translation: "Do they not reflect upon the Quran? Had it been from other than Allah, they would have found within it much contradiction.",
    ref: "Surah An-Nisa 4:82"
  },
  "4:101": {
    arabic: "وَإِذَا ضَرَبْتُمْ فِي الْأَرْضِ فَلَيْسَ عَلَيْكُمْ جُنَاحٌ أَن تَقْصُرُوا مِنَ الصَّلَاةِ",
    translation: "And when you travel throughout the land, there is no blame upon you for shortening the prayer.",
    ref: "Surah An-Nisa 4:101"
  },
  "6:38": {
    arabic: "مَّا فَرَّطْنَا فِي الْكِتَابِ مِن شَيْءٍ",
    translation: "We have not neglected in the Register a single thing.",
    ref: "Surah Al-An'am 6:38"
  },
  "6:114": {
    arabic: "أَفَغَيْرَ اللَّهِ أَبْتَغِي حَكَمًا وَهُوَ الَّذِي أَنزَلَ إِلَيْكُمُ الْكِتَابَ مُفَصَّلًا",
    translation: "Shall I seek other than Allah as a judge while it is He who has revealed to you the Book explained in detail?",
    ref: "Surah Al-An'am 6:114"
  },
  "11:13": {
    arabic: "أَمْ يَقُولُونَ افْتَرَاهُ ۖ قُلْ فَأْتُوا بِعَشْرِ سُوَرٍ مِّثْلِهِ مُفْتَرَيَاتٍ",
    translation: "Or do they say he invented it? Say: Then bring ten chapters like it, invented.",
    ref: "Surah Hud 11:13"
  },
  "14:24": {
    arabic: "أَلَمْ تَرَ كَيْفَ ضَرَبَ اللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ طَيِّبَةٍ",
    translation: "Do you not see how Allah sets forth a parable — a good word is like a good tree.",
    ref: "Surah Ibrahim 14:24"
  },
  "17:78": {
    arabic: "أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ",
    translation: "Establish prayer at the decline of the sun until the darkness of night, and the Quran of dawn — indeed, the recitation of dawn is witnessed.",
    ref: "Surah Al-Isra 17:78"
  },
  "17:88": {
    arabic: "قُل لَّئِنِ اجْتَمَعَتِ الْإِنسُ وَالْجِنُّ عَلَىٰ أَن يَأْتُوا بِمِثْلِ هَٰذَا الْقُرْآنِ لَا يَأْتُونَ بِمِثْلِهِ وَلَوْ كَانَ بَعْضُهُمْ لِبَعْضٍ ظَهِيرًا",
    translation: "Say: If mankind and the jinn gathered together to produce the like of this Quran, they could not produce the like of it, even if they were to each other assistants.",
    ref: "Surah Al-Isra 17:88"
  },
  "19:30": {
    arabic: "قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا",
    translation: "He said: Indeed, I am the servant of Allah. He has given me the Scripture and made me a prophet.",
    ref: "Surah Maryam 19:30"
  },
  "22:78": {
    arabic: "وَمَا جَعَلَ عَلَيْكُمْ فِي الدِّينِ مِنْ حَرَجٍ",
    translation: "He has chosen you and has not placed upon you in the religion any difficulty.",
    ref: "Surah Al-Hajj 22:78"
  },
  "24:58": {
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا لِيَسْتَأْذِنكُمُ الَّذِينَ مَلَكَتْ أَيْمَانُكُمْ وَالَّذِينَ لَمْ يَبْلُغُوا الْحُلُمَ مِنكُمْ ثَلَاثَ مَرَّاتٍ",
    translation: "O you who believe, let those your right hands possess and those who have not yet reached puberty among you ask your permission at three times — before the dawn prayer, when you put aside your clothing at noon, and after the night prayer.",
    ref: "Surah An-Nur 24:58"
  },
  "30:21": {
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    translation: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.",
    ref: "Surah Ar-Rum 30:21"
  },
  "42:21": {
    arabic: "أَمْ لَهُمْ شُرَكَاءُ شَرَعُوا لَهُم مِّنَ الدِّينِ مَا لَمْ يَأْذَن بِهِ اللَّهُ",
    translation: "Or have they partners who have laid down for them a religion which Allah has not permitted?",
    ref: "Surah Ash-Shura 42:21"
  },
  "45:6": {
    arabic: "تِلْكَ آيَاتُ اللَّهِ نَتْلُوهَا عَلَيْكَ بِالْحَقِّ ۖ فَبِأَيِّ حَدِيثٍ بَعْدَ اللَّهِ وَآيَاتِهِ يُؤْمِنُونَ",
    translation: "These are the verses of Allah which We recite to you in truth. Then in what hadith after Allah and His verses will they believe?",
    ref: "Surah Al-Jathiyah 45:6"
  },
  "53:3": {
    arabic: "وَمَا يَنطِقُ عَنِ الْهَوَىٰ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ",
    translation: "Nor does he speak from his own desire. It is not but a revelation revealed.",
    ref: "Surah An-Najm 53:3–4"
  },
  "53:4": {
    arabic: "إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ",
    translation: "It is not but a revelation revealed.",
    ref: "Surah An-Najm 53:4"
  },
  "80:1": {
    arabic: "عَبَسَ وَتَوَلَّىٰ أَن جَاءَهُ الْأَعْمَىٰ",
    translation: "He frowned and turned away because there came to him the blind man.",
    ref: "Surah Abasa 80:1–2"
  },
  "93:9": {
    arabic: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ",
    translation: "So as for the orphan, do not oppress him.",
    ref: "Surah Ad-Duha 93:9"
  },
  "112:1": {
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translation: "Say: He is Allah, the One.",
    ref: "Surah Al-Ikhlas 112:1"
  },
  "16:15": {
    arabic: "وَأَلْقَىٰ فِي الْأَرْضِ رَوَاسِيَ أَن تَمِيدَ بِكُمْ وَأَنْهَارًا وَسُبُلًا لَّعَلَّكُمْ تَهْتَدُونَ",
    translation: "And He has cast into the earth firmly set mountains, lest it shift with you, and rivers and roads, that you may be guided.",
    ref: "Surah An-Nahl 16:15"
  },
  "21:31": {
    arabic: "وَجَعَلْنَا فِي الْأَرْضِ رَوَاسِيَ أَن تَمِيدَ بِهِمْ وَجَعَلْنَا فِيهَا فِجَاجًا سُبُلًا لَّعَلَّهُمْ يَهْتَدُونَ",
    translation: "And We placed within the earth firmly set mountains, lest it should shift with them, and We made therein broad passageways that they might be guided.",
    ref: "Surah Al-Anbya 21:31"
  },
  "27:88": {
    arabic: "وَتَرَى الْجِبَالَ تَحْسَبُهَا جَامِدَةً وَهِيَ تَمُرُّ مَرَّ السَّحَابِ ۚ صُنْعَ اللَّهِ الَّذِي أَتْقَنَ كُلَّ شَيْءٍ",
    translation: "And you see the mountains, thinking them rigid, while they will pass as the passing of clouds. It is the work of Allah, who perfected all things.",
    ref: "Surah An-Naml 27:88"
  },
  "31:10": {
    arabic: "خَلَقَ السَّمَاوَاتِ بِغَيْرِ عَمَدٍ تَرَوْنَهَا ۖ وَأَلْقَىٰ فِي الْأَرْضِ رَوَاسِيَ أَن تَمِيدَ بِكُمْ",
    translation: "He created the heavens without pillars that you see, and has cast into the earth firmly set mountains, lest it shift with you.",
    ref: "Surah Luqman 31:10"
  },
  "78:7": {
    arabic: "وَالْجِبَالَ أَوْتَادًا",
    translation: "And the mountains as pegs?",
    ref: "Surah An-Naba 78:7"
  },
  "2:177": {
    arabic: "وَآتَى الْمَالَ عَلَىٰ حُبِّهِ ذَوِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينَ وَابْنَ السَّبِيلِ وَالسَّائِلِينَ وَفِي الرِّقَابِ",
    translation: "And gives wealth, in spite of love for it, to relatives, orphans, the needy, the traveler, those who ask, and for freeing slaves.",
    ref: "Surah Al-Baqarah 2:177"
  },
  "4:92": {
    arabic: "وَمَن قَتَلَ مُؤْمِنًا خَطَأً فَتَحْرِيرُ رَقَبَةٍ مُّؤْمِنَةٍ",
    translation: "And whoever kills a believer by mistake, then the freeing of a believing slave is required.",
    ref: "Surah An-Nisa 4:92"
  },
  "9:60": {
    arabic: "إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ",
    translation: "Zakat is only for the poor, the needy, those who administer it, those whose hearts are to be reconciled, for freeing slaves, for those in debt, for the cause of Allah, and for the traveler.",
    ref: "Surah At-Tawba 9:60"
  },
  "24:33": {
    arabic: "وَالَّذِينَ يَبْتَغُونَ الْكِتَابَ مِمَّا مَلَكَتْ أَيْمَانُكُمْ فَكَاتِبُوهُمْ إِنْ عَلِمْتُمْ فِيهِمْ خَيْرًا ۖ وَآتُوهُم مِّن مَّالِ اللَّهِ الَّذِي آتَاكُمْ",
    translation: "And those who seek a contract of emancipation from among those your right hands possess, make the contract with them if you know there is good in them, and give them from the wealth of Allah which He has given you.",
    ref: "Surah An-Nur 24:33"
  },
  "47:4": {
    arabic: "فَإِمَّا مَنًّا بَعْدُ وَإِمَّا فِدَاءً حَتَّىٰ تَضَعَ الْحَرْبُ أَوْزَارَهَا",
    translation: "Then either confer favor afterward by freeing them, or ransom them, until the war lays down its burdens.",
    ref: "Surah Muhammad 47:4"
  },
  "90:13": {
    arabic: "فَكُّ رَقَبَةٍ",
    translation: "It is the freeing of a slave.",
    ref: "Surah Al-Balad 90:13"
  },
  "96:1": {
    arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    translation: "Recite in the name of your Lord who created.",
    ref: "Surah Al-Alaq 96:1 — the first words ever revealed: a command to recite, not just to read. The Quran names itself the Recitation (Quran) from this root."
  },
  "75:16": {
    arabic: "لَا تُحَرِّكْ بِهِ لِسَانَكَ لِتَعْجَلَ بِهِ",
    translation: "Do not move your tongue with it to hasten it.",
    ref: "Surah Al-Qiyamah 75:16 — God speaking to the Prophet about the act of reciting: upon Allah is its collection and its recitation."
  },
  "73:4": {
    arabic: "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
    translation: "And recite the Quran with measured, distinct recitation.",
    ref: "Surah Al-Muzzammil 73:4 — God commands slow, deliberate oral recitation — the Quran was designed to be spoken and heard."
  },
  "17:106": {
    arabic: "وَقُرْآنًا فَرَقْنَاهُ لِتَقْرَأَهُ عَلَى النَّاسِ عَلَىٰ مُكْثٍ وَنَزَّلْنَاهُ تَنزِيلًا",
    translation: "And it is a Quran which We have separated so that you may recite it to the people over a prolonged period. And We have sent it down progressively.",
    ref: "Surah Al-Isra 17:106 — the Quran was revealed gradually on purpose, so it could be recited to people slowly over time."
  },
  "2:121": {
    arabic: "الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَتْلُونَهُ حَقَّ تِلَاوَتِهِ",
    translation: "Those to whom We have given the Book recite it with its true recitation.",
    ref: "Surah Al-Baqarah 2:121 — tilawa (recitation) is the proper mode of engaging the Book."
  },
  "9:6": {
    arabic: "وَإِنْ أَحَدٌ مِّنَ الْمُشْرِكِينَ اسْتَجَارَكَ فَأَجِرْهُ حَتَّىٰ يَسْمَعَ كَلَامَ اللَّهِ",
    translation: "And if any of the polytheists seeks your protection, then grant him protection so that he may hear the words of Allah.",
    ref: "Surah At-Tawbah 9:6 — the Quran calls itself 'the words of Allah' (kalam Allah) — God's own speech, not Muhammad's."
  },
  "4:164": {
    arabic: "وَكَلَّمَ اللَّهُ مُوسَىٰ تَكْلِيمًا",
    translation: "And Allah spoke to Moses with direct speech.",
    ref: "Surah An-Nisa 4:164 — Allah speaks directly. The Quran is kalam Allah — divine speech, not human composition."
  },
  "42:51": {
    arabic: "وَمَا كَانَ لِبَشَرٍ أَن يُكَلِّمَهُ اللَّهُ إِلَّا وَحْيًا أَوْ مِن وَرَاءِ حِجَابٍ أَوْ يُرْسِلَ رَسُولًا فَيُوحِيَ بِإِذْنِهِ مَا يَشَاءُ",
    translation: "It is not for any human that Allah should speak to him except through revelation or from behind a veil or by sending a messenger to reveal, by His permission, what He wills.",
    ref: "Surah Ash-Shura 42:51 — three modes of divine communication: direct revelation, behind a veil, or via a messenger-angel."
  },
  "18:109": {
    arabic: "قُل لَّوْ كَانَ الْبَحْرُ مِدَادًا لِّكَلِمَاتِ رَبِّي لَنَفِدَ الْبَحْرُ قَبْلَ أَن تَنفَدَ كَلِمَاتُ رَبِّي وَلَوْ جِئْنَا بِمِثْلِهِ مَدَدًا",
    translation: "Say: If the sea were ink for the words of my Lord, the sea would be exhausted before the words of my Lord were exhausted, even if We brought the like of it as a supplement.",
    ref: "Surah Al-Kahf 18:109 — the words of Allah are infinite; the Quran is a portion sent down for humanity."
  },
  "31:27": {
    arabic: "وَلَوْ أَنَّ مَا فِي الْأَرْضِ مِن شَجَرَةٍ أَقْلَامٌ وَالْبَحْرُ يَمُدُّهُ مِن بَعْدِهِ سَبْعَةُ أَبْحُرٍ مَّا نَفِدَتْ كَلِمَاتُ اللَّهِ",
    translation: "And if whatever trees upon the earth were pens and the sea was ink, replenished thereafter by seven more seas, the words of Allah would not be exhausted.",
    ref: "Surah Luqman 31:27 — the words of Allah are beyond all count. These are not human words."
  },
  "2:2": {
    arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    translation: "This is the Book, there is no doubt in it, a guidance for those who are conscious of Allah.",
    ref: "Surah Al-Baqarah 2:2 — the Quran opens by naming itself a Book (Kitab): written, certain, and complete."
  },
  "56:77": {
    arabic: "إِنَّهُ لَقُرْآنٌ كَرِيمٌ",
    translation: "Indeed, it is a noble Quran.",
    ref: "Surah Al-Waqi'ah 56:77 — in a well-guarded Book, touched only by the purified. Written and preserved."
  },
  "85:21": {
    arabic: "بَلْ هُوَ قُرْآنٌ مَّجِيدٌ",
    translation: "But this is a glorious Quran.",
    ref: "Surah Al-Buruj 85:21 — in a Preserved Tablet (85:22). The Quran exists written in the highest record."
  },
  "54:17": {
    arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
    translation: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?",
    ref: "Surah Al-Qamar 54:17 — Allah made the Quran easy to memorize on purpose. This verse repeats four times in one chapter."
  },
  "29:49": {
    arabic: "بَلْ هُوَ آيَاتٌ بَيِّنَاتٌ فِي صُدُورِ الَّذِينَ أُوتُوا الْعِلْمَ",
    translation: "Rather, it is clear verses in the chests of those who have been given knowledge.",
    ref: "Surah Al-Ankabut 29:49 — the Quran lives in human hearts and chests, not only on pages. Oral transmission is divine design."
  },
  "6:91": {
    arabic: "قُلْ مَنْ أَنزَلَ الْكِتَابَ الَّذِي جَاءَ بِهِ مُوسَىٰ نُورًا وَهُدًى لِّلنَّاسِ ۖ تَجْعَلُونَهُ قَرَاطِيسَ تُبْدُونَهَا وَتُخْفُونَ كَثِيرًا",
    translation: "Say: Who revealed the Book that Moses brought as light and guidance for the people, which you make into pages, showing some of it and hiding much?",
    ref: "Surah Al-An'am 6:91 — made into pages, some shown, much hidden."
  },
  "4:46": {
    arabic: "مِّنَ الَّذِينَ هَادُوا يُحَرِّفُونَ الْكَلِمَ عَن مَّوَاضِعِهِ",
    translation: "Among the Jews are those who distort words from their proper places.",
    ref: "Surah An-Nisa 4:46 — distorting the words."
  },
  "5:13": {
    arabic: "يُحَرِّفُونَ الْكَلِمَ عَن مَّوَاضِعِهِ وَنَسُوا حَظًّا مِّمَّا ذُكِّرُوا بِهِ",
    translation: "They distort words from their places and have forgotten a portion of what they were reminded of.",
    ref: "Surah Al-Maidah 5:13 — distortion and a forgotten portion."
  },
  "5:15": {
    arabic: "يَا أَهْلَ الْكِتَابِ قَدْ جَاءَكُمْ رَسُولُنَا يُبَيِّنُ لَكُمْ كَثِيرًا مِّمَّا كُنتُمْ تُخْفُونَ مِنَ الْكِتَابِ",
    translation: "O People of the Book, Our Messenger has come to make clear to you much of what you used to hide of the Scripture.",
    ref: "Surah Al-Maidah 5:15 — much of the Scripture was hidden."
  },
  "3:78": {
    arabic: "وَإِنَّ مِنْهُمْ لَفَرِيقًا يَلْوُونَ أَلْسِنَتَهُم بِالْكِتَابِ لِتَحْسَبُوهُ مِنَ الْكِتَابِ وَمَا هُوَ مِنَ الْكِتَابِ",
    translation: "Among them is a group who twist their tongues with the Scripture so you think it is from the Scripture, while it is not from the Scripture.",
    ref: "Surah Aal-Imran 3:78 — passing off non-scripture as scripture."
  },
  "5:44": {
    arabic: "إِنَّا أَنزَلْنَا التَّوْرَاةَ فِيهَا هُدًى وَنُورٌ",
    translation: "Indeed, We sent down the Torah, in which was guidance and light.",
    ref: "Surah Al-Maidah 5:44 — the Quran affirms the Torah's divine origin."
  },
  "2:42": {
    arabic: "وَلَا تَلْبِسُوا الْحَقَّ بِالْبَاطِلِ وَتَكْتُمُوا الْحَقَّ وَأَنتُمْ تَعْلَمُونَ",
    translation: "And do not mix the truth with falsehood, nor conceal the truth while you know it.",
    ref: "Surah Al-Baqarah 2:42 — the charge of mixing and concealing."
  },
  "2:97": {
    arabic: "قُلْ مَن كَانَ عَدُوًّا لِّجِبْرِيلَ فَإِنَّهُ نَزَّلَهُ عَلَىٰ قَلْبِكَ بِإِذْنِ اللَّهِ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ",
    translation: "Say: Whoever is an enemy to Jibril, it is he who brought it down upon your heart, by Allah's permission, confirming what came before it.",
    ref: "Surah Al-Baqarah 2:97 — Jibril named as the bringer of the revelation."
  },
  "2:98": {
    arabic: "مَن كَانَ عَدُوًّا لِّلَّهِ وَمَلَائِكَتِهِ وَرُسُلِهِ وَجِبْرِيلَ وَمِيكَالَ فَإِنَّ اللَّهَ عَدُوٌّ لِّلْكَافِرِينَ",
    translation: "Whoever is an enemy to Allah and His angels and His messengers and Jibril and Mikail, then Allah is an enemy to the disbelievers.",
    ref: "Surah Al-Baqarah 2:98 — Jibril and Mikail (Gabriel and Michael), the same pair named in the Bible."
  },
  "66:4": {
    arabic: "فَإِنَّ اللَّهَ هُوَ مَوْلَاهُ وَجِبْرِيلُ وَصَالِحُ الْمُؤْمِنِينَ",
    translation: "Then indeed Allah is his protector, and Jibril, and the righteous believers.",
    ref: "Surah At-Tahrim 66:4 — Jibril named a third time, as a supporter of the Prophet."
  },
  "26:193": {
    arabic: "نَزَلَ بِهِ الرُّوحُ الْأَمِينُ ۝ عَلَىٰ قَلْبِكَ لِتَكُونَ مِنَ الْمُنذِرِينَ",
    translation: "The trustworthy Spirit brought it down upon your heart, that you may be among the warners.",
    ref: "Surah Ash-Shu'ara 26:193-194 — Jibril, the trustworthy Spirit of revelation."
  },
  "19:17": {
    arabic: "فَأَرْسَلْنَا إِلَيْهَا رُوحَنَا فَتَمَثَّلَ لَهَا بَشَرًا سَوِيًّا",
    translation: "Then We sent to her Our Spirit, and he appeared to her as a well-proportioned man.",
    ref: "Surah Maryam 19:17 — Gabriel announces Jesus to Mary, the same act as in the Gospel of Luke."
  },
  "81:25": {
    arabic: "وَمَا هُوَ بِقَوْلِ شَيْطَانٍ رَّجِيمٍ",
    translation: "And it is not the word of an accursed devil.",
    ref: "Surah At-Takwir 81:25 — the Quran explicitly denies a devil brought it."
  },
  "81:19": {
    arabic: "إِنَّهُ لَقَوْلُ رَسُولٍ كَرِيمٍ ۝ ذِي قُوَّةٍ عِندَ ذِي الْعَرْشِ مَكِينٍ",
    translation: "Indeed, it is the word of a noble messenger, possessor of power, secure with the Lord of the Throne.",
    ref: "Surah At-Takwir 81:19-20 — Jibril described as a noble, powerful angel before God's Throne."
  },
  "53:5": {
    arabic: "عَلَّمَهُ شَدِيدُ الْقُوَىٰ",
    translation: "He was taught by one intense in strength.",
    ref: "Surah An-Najm 53:5 — the mighty angel who taught the Prophet; Gabriel's name itself means strength of God."
  },
  "26:210": {
    arabic: "وَمَا تَنَزَّلَتْ بِهِ الشَّيَاطِينُ ۝ وَمَا يَنبَغِي لَهُمْ وَمَا يَسْتَطِيعُونَ",
    translation: "And the devils have not brought it down. It is not fitting for them, nor are they able.",
    ref: "Surah Ash-Shu'ara 26:210-211 — the devils neither brought the revelation nor could."
  },
  "26:211": {
    arabic: "إِنَّهُمْ عَنِ السَّمْعِ لَمَعْزُولُونَ",
    translation: "Indeed, they are removed from hearing it.",
    ref: "Surah Ash-Shu'ara 26:211 — the devils are cut off from the revelation."
  },
  "26:212": {
    arabic: "فَلَا تَدْعُ مَعَ اللَّهِ إِلَٰهًا آخَرَ فَتَكُونَ مِنَ الْمُعَذَّبِينَ",
    translation: "So do not call upon another deity besides Allah, lest you be among those who are punished.",
    ref: "Surah Ash-Shu'ara 26:212 — closing of the passage establishing revelation's integrity."
  },
  "15:17": {
    arabic: "وَحَفِظْنَاهَا مِن كُلِّ شَيْطَانٍ رَّجِيمٍ",
    translation: "And We have guarded it from every accursed devil.",
    ref: "Surah Al-Hijr 15:17 — the revelation is protected by Allah from every devil."
  },
  "53:11": {
    arabic: "مَا كَذَبَ الْفُؤَادُ مَا رَأَىٰ",
    translation: "The heart did not lie about what it saw.",
    ref: "Surah An-Najm 53:11 — the Prophet's perception of the angel was real, not imagined."
  },
  "53:13": {
    arabic: "وَلَقَدْ رَآهُ نَزْلَةً أُخْرَىٰ",
    translation: "And he certainly saw him in another descent.",
    ref: "Surah An-Najm 53:13 — the Prophet saw the angel a second time."
  },
  "53:14": {
    arabic: "عِندَ سِدْرَةِ الْمُنتَهَىٰ",
    translation: "Near the Lote Tree of the Utmost Boundary.",
    ref: "Surah An-Najm 53:14 — the location of the Prophet's vision, the Sidrat al-Muntaha."
  },
  "53:28": {
    arabic: "وَمَا لَهُم بِهِۦ مِنْ عِلْمٍ ۖ إِن يَتَّبِعُونَ إِلَّا ٱلظَّنَّ ۖ وَإِنَّ ٱلظَّنَّ لَا يُغْنِى مِنَ ٱلْحَقِّ شَيْـًۭٔا",
    translation: "And they have no knowledge of it. They follow nothing but conjecture, and conjecture avails nothing against the truth.",
    ref: "Surah An-Najm 53:28"
  },
  "10:16": {
    arabic: "قُل لَّوْ شَاءَ اللَّهُ مَا تَلَوْتُهُ عَلَيْكُمْ وَلَا أَدْرَاكُم بِهِ ۖ فَقَدْ لَبِثْتُ فِيكُمْ عُمُرًا مِّن قَبْلِهِ ۚ أَفَلَا تَعْقِلُونَ",
    translation: "Say: had Allah willed, I would not have recited it to you, nor would He have made it known to you. For I remained among you a lifetime before it. Will you not then reason?",
    ref: "Surah Yunus 10:16"
  },
  "2:222": {
    arabic: "وَيَسْأَلُونَكَ عَنِ الْمَحِيضِ ۖ قُلْ هُوَ أَذًى فَاعْتَزِلُوا النِّسَاءَ فِي الْمَحِيضِ ۖ وَلَا تَقْرَبُوهُنَّ حَتَّىٰ يَطْهُرْنَ",
    translation: "And they ask you about menstruation. Say: it is harm, so keep away from wives during menstruation, and do not approach them until they are pure.",
    ref: "Surah Al-Baqarah 2:222"
  },
  "2:106": {
    arabic: "مَا نَنسَخْ مِنْ آيَةٍ أَوْ نُنسِهَا نَأْتِ بِخَيْرٍ مِّنْهَا أَوْ مِثْلِهَا",
    translation: "We do not abrogate a verse or cause it to be forgotten except that We bring one better than it or similar to it.",
    ref: "Surah Al-Baqarah 2:106. Speaks of replacement with better or similar, but never names which verses are replaced."
  },
  "2:191": {
    arabic: "وَاقْتُلُوهُمْ حَيْثُ ثَقِفْتُمُوهُمْ وَأَخْرِجُوهُم مِّنْ حَيْثُ أَخْرَجُوكُمْ ۚ وَالْفِتْنَةُ أَشَدُّ مِنَ الْقَتْلِ",
    translation: "And kill them wherever you find them, and drive them out from where they drove you out. And persecution is worse than killing.",
    ref: "Surah Al-Baqarah 2:191. Bounded before by 2:190 (those who fight you) and after by 2:192 (if they cease)."
  },
  "2:192": {
    arabic: "فَإِنِ انتَهَوْا فَإِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
    translation: "But if they cease, then indeed Allah is Forgiving and Merciful.",
    ref: "Surah Al-Baqarah 2:192. The exit clause that immediately follows the command to fight."
  },
  "2:193": {
    arabic: "وَقَاتِلُوهُمْ حَتَّىٰ لَا تَكُونَ فِتْنَةٌ وَيَكُونَ الدِّينُ لِلَّهِ ۖ فَإِنِ انتَهَوْا فَلَا عُدْوَانَ إِلَّا عَلَى الظَّالِمِينَ",
    translation: "And fight them until there is no persecution and worship is for Allah. But if they cease, then there is no aggression except against the oppressors.",
    ref: "Surah Al-Baqarah 2:193"
  },
  "8:30": {
    arabic: "وَإِذْ يَمْكُرُ بِكَ الَّذِينَ كَفَرُوا لِيُثْبِتُوكَ أَوْ يَقْتُلُوكَ أَوْ يُخْرِجُوكَ",
    translation: "And remember when those who disbelieved plotted against you to imprison you, or kill you, or drive you out.",
    ref: "Surah Al-Anfal 8:30. The Quran's reference to the assassination plot on the night of the Hijra."
  },
  "8:39": {
    arabic: "وَقَاتِلُوهُمْ حَتَّىٰ لَا تَكُونَ فِتْنَةٌ وَيَكُونَ الدِّينُ كُلُّهُ لِلَّهِ ۚ فَإِنِ انتَهَوْا فَإِنَّ اللَّهَ بِمَا يَعْمَلُونَ بَصِيرٌ",
    translation: "And fight them until there is no persecution and the religion is wholly for Allah. But if they cease, then indeed Allah is Seeing of what they do.",
    ref: "Surah Al-Anfal 8:39. Like 2:193, the aim is ending persecution, and it stops the moment the enemy stops."
  },
  "4:90": {
    arabic: "فَإِنِ اعْتَزَلُوكُمْ فَلَمْ يُقَاتِلُوكُمْ وَأَلْقَوْا إِلَيْكُمُ السَّلَمَ فَمَا جَعَلَ اللَّهُ لَكُمْ عَلَيْهِمْ سَبِيلًا",
    translation: "So if they keep away from you and do not fight you and offer you peace, then Allah has not given you any way against them.",
    ref: "Surah An-Nisa 4:90"
  },
  "9:4": {
    arabic: "إِلَّا الَّذِينَ عَاهَدتُّم مِّنَ الْمُشْرِكِينَ ثُمَّ لَمْ يَنقُصُوكُمْ شَيْئًا وَلَمْ يُظَاهِرُوا عَلَيْكُمْ أَحَدًا فَأَتِمُّوا إِلَيْهِمْ عَهْدَهُمْ إِلَىٰ مُدَّتِهِمْ",
    translation: "Except those polytheists with whom you made a treaty and who then did not break it nor support anyone against you. So complete their treaty with them to its end.",
    ref: "Surah At-Tawbah 9:4. The exemption that comes immediately before 9:5."
  },
  "9:5": {
    arabic: "فَإِذَا انسَلَخَ الْأَشْهُرُ الْحُرُمُ فَاقْتُلُوا الْمُشْرِكِينَ حَيْثُ وَجَدتُّمُوهُمْ وَخُذُوهُمْ وَاحْصُرُوهُمْ وَاقْعُدُوا لَهُمْ كُلَّ مَرْصَدٍ ۚ فَإِن تَابُوا وَأَقَامُوا الصَّلَاةَ وَآتَوُا الزَّكَاةَ فَخَلُّوا سَبِيلَهُمْ ۚ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
    translation: "When the sacred months have passed, fight the polytheists wherever you find them, and seize them, and besiege them, and lie in wait for them at every outpost. But if they repent and establish prayer and give charity, let them go on their way. Indeed, Allah is Forgiving and Merciful.",
    ref: "Surah At-Tawbah 9:5. The verse itself ends by releasing those who stop fighting."
  },
  "9:13": {
    arabic: "أَلَا تُقَاتِلُونَ قَوْمًا نَّكَثُوا أَيْمَانَهُمْ وَهَمُّوا بِإِخْرَاجِ الرَّسُولِ وَهُم بَدَءُوكُمْ أَوَّلَ مَرَّةٍ",
    translation: "Will you not fight a people who broke their oaths and intended to expel the Messenger, and it was they who began against you the first time?",
    ref: "Surah At-Tawbah 9:13. The Quran states the enemy attacked first."
  },
  "9:29": {
    arabic: "قَاتِلُوا الَّذِينَ لَا يُؤْمِنُونَ بِاللَّهِ وَلَا بِالْيَوْمِ الْآخِرِ وَلَا يُحَرِّمُونَ مَا حَرَّمَ اللَّهُ وَرَسُولُهُ وَلَا يَدِينُونَ دِينَ الْحَقِّ مِنَ الَّذِينَ أُوتُوا الْكِتَابَ حَتَّىٰ يُعْطُوا الْجِزْيَةَ عَن يَدٍ وَهُمْ صَاغِرُونَ",
    translation: "Fight those who do not believe in Allah or the Last Day, who do not forbid what Allah and His Messenger have forbidden, and who do not follow the religion of truth, from among those given the Scripture, until they pay the tribute willingly while subdued.",
    ref: "Surah At-Tawbah 9:29. Revealed in the context of the hostile Byzantine frontier."
  },
  "22:39": {
    arabic: "أُذِنَ لِلَّذِينَ يُقَاتَلُونَ بِأَنَّهُمْ ظُلِمُوا ۚ وَإِنَّ اللَّهَ عَلَىٰ نَصْرِهِمْ لَقَدِيرٌ",
    translation: "Permission is given to those who are being fought, because they were wronged. And indeed, Allah is able to give them victory.",
    ref: "Surah Al-Hajj 22:39. Traditionally the first verse permitting the Muslims to fight."
  },
  "22:40": {
    arabic: "الَّذِينَ أُخْرِجُوا مِن دِيَارِهِم بِغَيْرِ حَقٍّ إِلَّا أَن يَقُولُوا رَبُّنَا اللَّهُ",
    translation: "Those who have been driven from their homes without right, only because they said: our Lord is Allah.",
    ref: "Surah Al-Hajj 22:40"
  },
  "5:43": {
    arabic: "وَكَيْفَ يُحَكِّمُونَكَ وَعِندَهُمُ التَّوْرَاةُ فِيهَا حُكْمُ اللَّهِ",
    translation: "But how is it that they come to you for judgment while they have the Torah, in which is the judgment of Allah?",
    ref: "Surah Al-Ma'idah 5:43"
  },
  "5:68": {
    arabic: "قُلْ يَا أَهْلَ الْكِتَابِ لَسْتُمْ عَلَىٰ شَيْءٍ حَتَّىٰ تُقِيمُوا التَّوْرَاةَ وَالْإِنجِيلَ",
    translation: "Say, O People of the Scripture, you stand on nothing until you uphold the Torah and the Gospel.",
    ref: "Surah Al-Ma'idah 5:68"
  },
  "5:14": {
    arabic: "وَمِنَ الَّذِينَ قَالُوا إِنَّا نَصَارَىٰ أَخَذْنَا مِيثَاقَهُمْ فَنَسُوا حَظًّا مِّمَّا ذُكِّرُوا بِهِ",
    translation: "And from those who say, We are Christians, We took their covenant, but they forgot a portion of what they were reminded of.",
    ref: "Surah Al-Ma'idah 5:14"
  },
  "9:36": {
    arabic: "إِنَّ عِدَّةَ الشُّهُورِ عِندَ اللَّهِ اثنَا عَشَرَ شَهْرًا فِي كِتَابِ اللَّهِ يَومَ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ مِنْهَا أَرْبَعَةٌ حُرُمٌ ۚ ذَٰلِكَ الدِّينُ الْقَيِّمُ",
    translation: "Indeed, the number of months with Allah is twelve months in the register of Allah from the day He created the heavens and the earth. Of these, four are sacred. That is the upright religion.",
    ref: "Surah At-Tawbah 9:36"
  },
  "9:37": {
    arabic: "إِنَّمَا النَّسِيءُ زِيَادَةٌ فِي الْكُفْرِ ۖ يُضَلُّ بِهِ الَّذِينَ كَفَرُوا يُحِلُّونَهُ عَامًا وَيُحَرِّمُونَهُ عَامًا",
    translation: "Indeed, the postponing of sacred months is an increase in disbelief, by which those who disbelieve are led astray. They make it lawful one year and unlawful another year.",
    ref: "Surah At-Tawbah 9:37"
  },
  "2:197": {
    arabic: "الْحَجُّ أَشْهُرٌ مَّعْلُومَاتٌ ۚ فَمَن فَرَضَ فِيهِنَّ الْحَجَّ فَلَا رَفَثَ وَلَا فُسُوقَ وَلَا جِدَالَ فِي الْحَجِّ",
    translation: "Hajj is during well-known months. So whoever undertakes the Hajj in them, there is no intimacy, no wrongdoing, and no quarreling during the Hajj.",
    ref: "Surah Al-Baqarah 2:197"
  },
  "5:2": {
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تُحِلُّوا شَعَائِرَ اللَّهِ وَلَا الشَّهْرَ الْحَرَامَ",
    translation: "O you who believe, do not violate the rites of Allah, nor the sacred month.",
    ref: "Surah Al-Ma'idah 5:2"
  },
  "5:97": {
    arabic: "جَعَلَ اللَّهُ الْكَعْبَةَ الْبَيْتَ الْحَرَامَ قِيَامًا لِّلنَّاسِ وَالشَّهْرَ الْحَرَامَ",
    translation: "Allah has made the Kaaba, the Sacred House, a standing point for the people, and likewise the sacred month.",
    ref: "Surah Al-Ma'idah 5:97"
  },
  "4:11": {
    arabic: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ ۚ فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ ۖ وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ",
    translation: "Allah instructs you concerning your children: for the male, what is equal to the share of two females. But if there are only daughters, two or more, for them is two thirds of what he left. And if there is only one, for her is half.",
    ref: "Surah An-Nisa 4:11"
  },
  "4:12": {
    arabic: "وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ ۚ فَإِن كَانَ لَهُنَّ وَلَدٌ فَلَكُمُ الرُّبُعُ مِمَّا تَرَكْنَ",
    translation: "For you is half of what your wives leave if they have no child. But if they have a child, for you is one fourth of what they leave.",
    ref: "Surah An-Nisa 4:12"
  },
  "4:176": {
    arabic: "يَسْتَفْتُونَكَ قُلِ اللَّهُ يُفْتِيكُمْ فِي الْكَلَالَةِ ۚ إِنِ امْرُؤٌ هَلَكَ لَيْسَ لَهُ وَلَدٌ وَلَهُ أُخْتٌ فَلَهَا نِصْفُ مَا تَرَكَ ۚ فَإِن كَانَتَا اثْنَتَيْنِ فَلَهُمَا الثُّلُثَانِ مِمَّا تَرَكَ",
    translation: "They request from you a ruling. Say, Allah gives you a ruling concerning one who leaves neither ascendants nor descendants. If a man dies leaving no child but having a sister, she gets half of what he left. And if there are two sisters, they get two thirds of what he left.",
    ref: "Surah An-Nisa 4:176"
  },
  "2:180": {
    arabic: "كُتِبَ عَلَيْكُمْ إِذَا حَضَرَ أَحَدَكُمُ الْمَوْتُ إِن تَرَكَ خَيْرًا الْوَصِيَّةُ لِلْوَالِدَيْنِ وَالْأَقْرَبِينَ بِالْمَعْرُوفِ ۖ حَقًّا عَلَى الْمُتَّقِينَ",
    translation: "It is made a duty for you, when death comes near one of you and he leaves wealth, to make a will for parents and close relatives, in fairness. A duty on the mindful.",
    ref: "Surah Al-Baqarah 2:180"
  },
  "4:8": {
    arabic: "وَإِذَا حَضَرَ الْقِسْمَةَ أُولُو الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينُ فَارْزُقُوهُم مِّنْهُ وَقُولُوا لَهُمْ قَوْلًا مَّعْرُوفًا",
    translation: "And when relatives, orphans, and the poor are there at the split, give them something from it, and speak to them kindly.",
    ref: "Surah An-Nisa 4:8"
  },
  "4:13": {
    arabic: "تِلْكَ حُدُودُ اللَّهِ ۚ وَمَن يُطِعِ اللَّهَ وَرَسُولَهُ يُدْخِلْهُ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ",
    translation: "These are the limits of Allah. Whoever obeys Allah and His Messenger, He will bring him into gardens with rivers flowing beneath.",
    ref: "Surah An-Nisa 4:13"
  },
  "2:23": {
    arabic: "وَإِن كُنتُمْ فِي رَيْبٍ مِّمَّا نَزَّلْنَا عَلَىٰ عَبْدِنَا فَأْتُوا بِسُورَةٍ مِّن مِّثْلِهِ وَادْعُوا شُهَدَاءَكُم مِّن دُونِ اللَّهِ إِن كُنتُمْ صَادِقِينَ",
    translation: "And if you are in doubt about what We have sent down upon Our Servant, then produce a surah the like thereof and call upon your witnesses other than Allah, if you should be truthful.",
    ref: "Surah Al-Baqarah 2:23"
  },
  "2:146": {
    arabic: "الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَعْرِفُونَهُ كَمَا يَعْرِفُونَ أَبْنَاءَهُمْ ۖ وَإِنَّ فَرِيقًا مِّنْهُمْ لَيَكْتُمُونَ الْحَقَّ وَهُمْ يَعْلَمُونَ",
    translation: "Those to whom We gave the Scripture know him as they know their own sons. But indeed, a party of them conceal the truth while they know it.",
    ref: "Surah Al-Baqarah 2:146"
  },
  "2:255": {
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ",
    translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission?",
    ref: "Surah Al-Baqarah 2:255 — Ayat al-Kursi"
  },
  "4:105": {
    arabic: "إِنَّا أَنزَلْنَا إِلَيْكَ الْكِتَابَ بِالْحَقِّ لِتَحْكُمَ بَيْنَ النَّاسِ بِمَا أَرَاكَ اللَّهُ ۚ وَلَا تَكُن لِّلْخَائِنِينَ خَصِيمًا",
    translation: "Indeed, We have revealed to you the Book in truth so you may judge between the people by that which Allah has shown you. And do not be an advocate for the deceitful.",
    ref: "Surah An-Nisa 4:105"
  },
  "7:204": {
    arabic: "وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا لَهُ وَأَنصِتُوا لَعَلَّكُمْ تُرْحَمُونَ",
    translation: "So when the Quran is recited, listen to it and pay attention that you may receive mercy.",
    ref: "Surah Al-A'raf 7:204"
  },
  "12:1": {
    arabic: "الر ۚ تِلْكَ آيَاتُ الْكِتَابِ الْمُبِينِ",
    translation: "Alif, Lam, Ra. These are the verses of the clear Book.",
    ref: "Surah Yusuf 12:1"
  },
  "16:89": {
    arabic: "وَيَوْمَ نَبْعَثُ فِي كُلِّ أُمَّةٍ شَهِيدًا عَلَيْهِم مِّنْ أَنفُسِهِمْ ۖ وَجِئْنَا بِكَ شَهِيدًا عَلَىٰ هَٰؤُلَاءِ ۚ وَنَزَّلْنَا عَلَيْكَ الْكِتَابَ تِبْيَانًا لِّكُلِّ شَيْءٍ وَهُدًى وَرَحْمَةً وَبُشْرَىٰ لِلْمُسْلِمِينَ",
    translation: "And We have sent down to you the Book as clarification for all things and as guidance and mercy and good tidings for the Muslims.",
    ref: "Surah An-Nahl 16:89"
  },
  "25:32": {
    arabic: "وَقَالَ الَّذِينَ كَفَرُوا لَوْلَا نُزِّلَ عَلَيْهِ الْقُرْآنُ جُمْلَةً وَاحِدَةً ۚ كَذَٰلِكَ لِنُثَبِّتَ بِهِ فُؤَادَكَ ۖ وَرَتَّلْنَاهُ تَرْتِيلًا",
    translation: "Those who disbelieve say, 'Why was the Quran not revealed to him all at once?' Thus We may strengthen thereby your heart. And We have spaced it distinctly.",
    ref: "Surah Al-Furqan 25:32"
  },
  "29:45": {
    arabic: "اتْلُ مَا أُوحِيَ إِلَيْكَ مِنَ الْكِتَابِ وَأَقِمِ الصَّلَاةَ ۖ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ ۗ وَلَذِكْرُ اللَّهِ أَكْبَرُ",
    translation: "Recite what has been revealed to you of the Book and establish prayer. Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater.",
    ref: "Surah Al-Ankabut 29:45"
  },
  "29:48": {
    arabic: "وَمَا كُنتَ تَتْلُو مِن قَبْلِهِ مِن كِتَابٍ وَلَا تَخُطُّهُ بِيَمِينِكَ ۖ إِذًا لَّارْتَابَ الْمُبْطِلُونَ",
    translation: "And you did not recite before it any scripture, nor did you inscribe one with your right hand. Otherwise the falsifiers would have had cause for doubt.",
    ref: "Surah Al-Ankabut 29:48"
  },
  "35:29": {
    arabic: "إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ",
    translation: "Indeed, those who recite the Book of Allah and establish prayer and spend out of what We have provided them, secretly and publicly, can expect a profit that will never perish.",
    ref: "Surah Fatir 35:29"
  },
  "38:29": {
    arabic: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ وَلِيَتَذَكَّرَ أُولُو الْأَلْبَابِ",
    translation: "A blessed Book which We have revealed to you, that they might reflect upon its verses and that those of understanding would be reminded.",
    ref: "Surah Sad 38:29"
  },
  "43:4": {
    arabic: "وَإِنَّهُ فِي أُمِّ الْكِتَابِ لَدَيْنَا لَعَلِيٌّ حَكِيمٌ",
    translation: "And indeed it, in the Mother of the Book with Us, is exalted and full of wisdom.",
    ref: "Surah Az-Zukhruf 43:4"
  },
  "73:20": {
    arabic: "فَاقْرَءُوا مَا تَيَسَّرَ مِنَ الْقُرْآنِ ۚ عَلِمَ أَن سَيَكُونُ مِنكُم مَّرْضَىٰ",
    translation: "So recite what is easy of the Quran. He has known that there will be among you those who are ill.",
    ref: "Surah Al-Muzzammil 73:20"
  },
  "87:6": {
    arabic: "سَنُقْرِئُكَ فَلَا تَنسَىٰ",
    translation: "We will make you recite, and you will not forget.",
    ref: "Surah Al-A'la 87:6"
  },
  "96:3": {
    arabic: "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ",
    translation: "Recite, and your Lord is the Most Generous.",
    ref: "Surah Al-Alaq 96:3"
  },
  "2:144": {
    arabic: "فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ ۚ وَحَيْثُ مَا كُنتُمْ فَوَلُّوا وُجُوهَكُمْ شَطْرَهُ",
    translation: "Turn your face toward the Sacred Mosque. And wherever you are, turn your faces toward it.",
    ref: "Surah Al-Baqarah 2:144"
  },
  "2:239": {
    arabic: "فَإِنْ خِفْتُمْ فَرِجَالًا أَوْ رُكْبَانًا",
    translation: "And if you are in fear, then pray on foot or riding.",
    ref: "Surah Al-Baqarah 2:239"
  },
  "17:110": {
    arabic: "وَلَا تَجْهَرْ بِصَلَاتِكَ وَلَا تُخَافِتْ بِهَا وَابْتَغِ بَيْنَ ذَٰلِكَ سَبِيلًا",
    translation: "Do not be loud in your prayer, and do not be silent in it, and seek a way between.",
    ref: "Surah Al-Isra 17:110"
  },
  "22:77": {
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا ارْكَعُوا وَاسْجُدُوا وَاعْبُدُوا رَبَّكُمْ وَافْعَلُوا الْخَيْرَ لَعَلَّكُمْ تُفْلِحُونَ",
    translation: "Believers, bow and prostrate and worship your Lord, and do good, so that you may succeed.",
    ref: "Surah Al-Hajj 22:77"
  },
  "48:29": {
    arabic: "تَرَاهُمْ رُكَّعًا سُجَّدًا يَبْتَغُونَ فَضْلًا مِّنَ اللَّهِ وَرِضْوَانًا ۖ سِيمَاهُمْ فِي وُجُوهِهِم مِّنْ أَثَرِ السُّجُودِ",
    translation: "You see them bowing and prostrating, seeking favor from Allah and His approval. Their mark is on their faces from the trace of prostration.",
    ref: "Surah Al-Fath 48:29"
  },
  "4:103": {
    arabic: "فَإِذَا قَضَيْتُمُ الصَّلَاةَ فَاذْكُرُوا اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِكُمْ ۚ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    translation: "When you have finished the prayer, remember Allah standing, sitting, and lying on your sides. The prayer is a timed duty upon the believers.",
    ref: "Surah An-Nisa 4:103"
  },
  "3:43": {
    arabic: "يَا مَرْيَمُ اقْنُتِي لِرَبِّكِ وَاسْجُدِي وَارْكَعِي مَعَ الرَّاكِعِينَ",
    translation: "Maryam, be devout to your Lord, and prostrate, and bow with those who bow.",
    ref: "Surah Aal-Imran 3:43"
  },
  "22:26": {
    arabic: "وَطَهِّرْ بَيْتِيَ لِلطَّائِفِينَ وَالْقَائِمِينَ وَالرُّكَّعِ السُّجُودِ",
    translation: "Purify My House for those who circle it, and those who stand, and those who bow and prostrate.",
    ref: "Surah Al-Hajj 22:26"
  },
  "19:58": {
    arabic: "إِذَا تُتْلَىٰ عَلَيْهِمْ آيَاتُ الرَّحْمَٰنِ خَرُّوا سُجَّدًا وَبُكِيًّا",
    translation: "When the verses of the Most Merciful were recited to them, they fell down prostrating and weeping.",
    ref: "Surah Maryam 19:58"
  },
  "69:44": {
    arabic: "وَلَوْ تَقَوَّلَ عَلَيْنَا بَعْضَ الْأَقَاوِيلِ لَأَخَذْنَا مِنْهُ بِالْيَمِينِ ثُمَّ لَقَطَعْنَا مِنْهُ الْوَتِينَ",
    translation: "If he had invented sayings in Our name, We would have seized him by the right hand, then cut his lifeline.",
    ref: "Surah Al-Haqqah 69:44-46"
  },
  "5:67": {
    arabic: "يَا أَيُّهَا الرَّسُولُ بَلِّغْ مَا أُنزِلَ إِلَيْكَ مِن رَّبِّكَ",
    translation: "O Messenger, deliver what has been sent down to you from your Lord.",
    ref: "Surah Al-Ma'idah 5:67"
  },
  "6:19": {
    arabic: "وَأُوحِيَ إِلَيَّ هَٰذَا الْقُرْآنُ لِأُنذِرَكُم بِهِ وَمَن بَلَغَ",
    translation: "This Quran has been revealed to me so that I may warn you with it, and whoever it reaches.",
    ref: "Surah Al-An'am 6:19"
  },
  "11:114": {
    arabic: "وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِّنَ اللَّيْلِ",
    translation: "Establish the prayer at the two ends of the day and in the early hours of the night.",
    ref: "Surah Hud 11:114"
  },
  "1:1": { arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Most Gracious, the Most Merciful.", ref: "Surah Al-Fatiha 1:1" },
  "2:75": { arabic: "أَفَتَطْمَعُونَ أَن يُؤْمِنُوا لَكُمْ وَقَدْ كَانَ فَرِيقٌ مِّنْهُمْ يَسْمَعُونَ كَلَامَ اللَّهِ ثُمَّ يُحَرِّفُونَهُ مِن بَعْدِ مَا عَقَلُوهُ وَهُمْ يَعْلَمُونَ", translation: "Do you then hope that they will believe you while a party of them used to hear the words of Allah and then distort it after they had understood it while they were knowing?", ref: "Surah Al-Baqarah 2:75" },
  "2:85": { arabic: "أَفَتُؤْمِنُونَ بِبَعْضِ الْكِتَابِ وَتَكْفُرُونَ بِبَعْضٍ ۚ فَمَا جَزَاءُ مَن يَفْعَلُ ذَٰلِكَ مِنكُمْ إِلَّا خِزْيٌ فِي الْحَيَاةِ الدُّنْيَا", translation: "So do you believe in part of the Scripture and disbelieve in part? Then what is the recompense for those among you who do that except disgrace in worldly life?", ref: "Surah Al-Baqarah 2:85" },
  "2:87": { arabic: "وَلَقَدْ آتَيْنَا مُوسَى الْكِتَابَ وَقَفَّيْنَا مِن بَعْدِهِ بِالرُّسُلِ ۖ وَآتَيْنَا عِيسَى ابْنَ مَرْيَمَ الْبَيِّنَاتِ وَأَيَّدْنَاهُ بِرُوحِ الْقُدُسِ", translation: "And We did certainly give Moses the Torah and followed up after him with messengers. And We gave Jesus, the son of Mary, clear proofs and supported him with the Pure Spirit.", ref: "Surah Al-Baqarah 2:87" },
  "2:101": { arabic: "وَلَمَّا جَاءَهُمْ رَسُولٌ مِّنْ عِندِ اللَّهِ مُصَدِّقٌ لِّمَا مَعَهُمْ نَبَذَ فَرِيقٌ مِّنَ الَّذِينَ أُوتُوا الْكِتَابَ كِتَابَ اللَّهِ وَرَاءَ ظُهُورِهِمْ كَأَنَّهُمْ لَا يَعْلَمُونَ", translation: "And when a messenger from Allah came to them confirming what was with them, a party of those who had been given the Scripture threw the Scripture of Allah behind their backs as if they did not know it.", ref: "Surah Al-Baqarah 2:101" },
  "2:159": { arabic: "إِنَّ الَّذِينَ يَكْتُمُونَ مَا أَنزَلْنَا مِنَ الْبَيِّنَاتِ وَالْهُدَىٰ مِن بَعْدِ مَا بَيَّنَّاهُ لِلنَّاسِ فِي الْكِتَابِ ۙ أُولَٰئِكَ يَلْعَنُهُمُ اللَّهُ وَيَلْعَنُهُمُ اللَّاعِنُونَ", translation: "Those who conceal what We sent down of clear proofs and guidance after We made it clear for the people in the Scripture — those are cursed by Allah and cursed by those who curse.", ref: "Surah Al-Baqarah 2:159" },
  "2:174": { arabic: "إِنَّ الَّذِينَ يَكْتُمُونَ مَا أَنزَلَ اللَّهُ مِنَ الْكِتَابِ وَيَشْتَرُونَ بِهِ ثَمَنًا قَلِيلًا ۙ أُولَٰئِكَ مَا يَأْكُلُونَ فِي بُطُونِهِمْ إِلَّا النَّارَ", translation: "Those who conceal what Allah has sent down of the Book and exchange it for a small price — those consume nothing into their bellies except fire.", ref: "Surah Al-Baqarah 2:174" },
  "3:3": { arabic: "نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ وَأَنزَلَ التَّوْرَاةَ وَالْإِنجِيلَ", translation: "He has sent down upon you the Book in truth, confirming what was before it. And He revealed the Torah and the Gospel.", ref: "Surah Aal-Imran 3:3" },
  "3:52": { arabic: "فَلَمَّا أَحَسَّ عِيسَىٰ مِنْهُمُ الْكُفْرَ قَالَ مَنْ أَنصَارِي إِلَى اللَّهِ ۖ قَالَ الْحَوَارِيُّونَ نَحْنُ أَنصَارُ اللَّهِ آمَنَّا بِاللَّهِ وَاشْهَدْ بِأَنَّا مُسْلِمُونَ", translation: "But when Jesus sensed disbelief from them, he said: Who are my supporters for Allah? The disciples said: We are supporters of Allah. We have believed in Allah and testify that we are Muslims.", ref: "Surah Aal-Imran 3:52" },
  "3:71": { arabic: "يَا أَهْلَ الْكِتَابِ لِمَ تَلْبِسُونَ الْحَقَّ بِالْبَاطِلِ وَتَكْتُمُونَ الْحَقَّ وَأَنتُمْ تَعْلَمُونَ", translation: "O People of the Scripture, why do you mix the truth with falsehood and conceal the truth while you know it?", ref: "Surah Aal-Imran 3:71" },
  "4:34": { arabic: "الرِّجَالُ قَوَّامُونَ عَلَى النِّسَاءِ بِمَا فَضَّلَ اللَّهُ بَعْضَهُمْ عَلَىٰ بَعْضٍ وَبِمَا أَنفَقُوا مِنْ أَمْوَالِهِمْ ۚ فَالصَّالِحَاتُ قَانِتَاتٌ حَافِظَاتٌ لِّلْغَيْبِ بِمَا حَفِظَ اللَّهُ ۚ وَاللَّاتِي تَخَافُونَ نُشُوزَهُنَّ فَعِظُوهُنَّ وَاهْجُرُوهُنَّ فِي الْمَضَاجِعِ وَاضْرِبُوهُنَّ ۖ فَإِنْ أَطَعْنَكُمْ فَلَا تَبْغُوا عَلَيْهِنَّ سَبِيلًا", translation: "Men are the maintainers of women, because Allah has made one of them excel the other, and because they spend out of their wealth. Therefore righteous women are devoutly obedient, guarding in the husband's absence what Allah would have them guard. As for those from whom you fear arrogance, admonish them, then leave them alone in the sleeping places, then strike them. If they obey you, seek no means against them.", ref: "Surah An-Nisa 4:34" },
  "5:16": { arabic: "يَهْدِي بِهِ اللَّهُ مَنِ اتَّبَعَ رِضْوَانَهُ سُبُلَ السَّلَامِ", translation: "By which Allah guides those who pursue His pleasure to the ways of peace.", ref: "Surah Al-Ma'idah 5:16" },
  "5:41": { arabic: "يَسْمَعُونَ لِلْكَذِبِ أَكَّالُونَ لِلسُّحْتِ", translation: "Listeners to falsehood, devourers of the unlawful.", ref: "Surah Al-Ma'idah 5:41" },
  "5:73": { arabic: "لَّقَدْ كَفَرَ الَّذِينَ قَالُوا إِنَّ اللَّهَ ثَالِثُ ثَلَاثَةٍ ۘ وَمَا مِنْ إِلَٰهٍ إِلَّا إِلَٰهٌ وَاحِدٌ ۚ وَإِن لَّمْ يَنتَهُوا عَمَّا يَقُولُونَ لَيَمَسَّنَّ الَّذِينَ كَفَرُوا مِنْهُمْ عَذَابٌ أَلِيمٌ", translation: "They have certainly disbelieved who say: Allah is the third of three. And there is no god except one God. And if they do not desist from what they are saying, there will surely afflict the disbelievers among them a painful punishment.", ref: "Surah Al-Ma'idah 5:73" },
  "5:82": { arabic: "وَلَتَجِدَنَّ أَقْرَبَهُم مَّوَدَّةً لِّلَّذِينَ آمَنُوا الَّذِينَ قَالُوا إِنَّا نَصَارَىٰ ۚ ذَٰلِكَ بِأَنَّ مِنْهُمْ قِسِّيسِينَ وَرُهْبَانًا وَأَنَّهُمْ لَا يَسْتَكْبِرُونَ", translation: "And you will find the nearest of them in affection to the believers those who say: We are Christians. That is because among them are priests and monks and because they are not arrogant.", ref: "Surah Al-Ma'idah 5:82" },
  "5:89": { arabic: "لَا يُؤَاخِذُكُمُ اللَّهُ بِاللَّغْوِ فِي أَيْمَانِكُمْ وَلَٰكِن يُؤَاخِذُكُم بِمَا عَقَّدتُّمُ الْأَيْمَانَ ۖ فَكَفَّارَتُهُ إِطْعَامُ عَشَرَةِ مَسَاكِينَ مِنْ أَوْسَطِ مَا تُطْعِمُونَ أَهْلِيكُمْ أَوْ كِسْوَتُهُمْ أَوْ تَحْرِيرُ رَقَبَةٍ", translation: "Allah will not impose blame upon you for what is meaningless in your oaths, but He will impose blame upon you for deliberate oaths. So its expiation is the feeding of ten poor persons from the average of what you feed your own families, or clothing them, or the freeing of a slave.", ref: "Surah Al-Ma'idah 5:89" },
  "5:111": { arabic: "وَإِذْ أَوْحَيْتُ إِلَى الْحَوَارِيِّينَ أَنْ آمِنُوا بِي وَبِرَسُولِي قَالُوا آمَنَّا وَاشْهَدْ بِأَنَّنَا مُسْلِمُونَ", translation: "And when I inspired to the disciples to believe in Me and in My messenger, they said: We have believed and testify that we are Muslims.", ref: "Surah Al-Ma'idah 5:111" },
  "6:112": { arabic: "وَكَذَٰلِكَ جَعَلْنَا لِكُلِّ نَبِيٍّ عَدُوًّا شَيَاطِينَ الْإِنسِ وَالْجِنِّ يُوحِي بَعْضُهُمْ إِلَىٰ بَعْضٍ زُخْرُفَ الْقَوْلِ غُرُورًا", translation: "And thus We have made for every prophet an enemy — devils from mankind and jinn, inspiring to one another decorative speech in delusion.", ref: "Surah Al-An'am 6:112" },
  "10:94": { arabic: "فَإِن كُنتَ فِي شَكٍّ مِّمَّا أَنزَلْنَا إِلَيْكَ فَاسْأَلِ الَّذِينَ يَقْرَءُونَ الْكِتَابَ مِن قَبْلِكَ", translation: "So if you are in doubt about what We have revealed to you, then ask those who have been reading the Scripture before you.", ref: "Surah Yunus 10:94" },
  "12:30": { arabic: "وَقَالَ نِسْوَةٌ فِي الْمَدِينَةِ امْرَأَتُ الْعَزِيزِ تُرَاوِدُ فَتَاهَا عَن نَّفْسِهِ ۖ قَدْ شَغَفَهَا حُبًّا ۖ إِنَّا لَنَرَاهَا فِي ضَلَالٍ مُّبِينٍ", translation: "And women in the city said: The wife of the Aziz is seeking to seduce her slave boy; he has inflamed her with love. Indeed, we see her in clear error.", ref: "Surah Yusuf 12:30" },
  "16:44": { arabic: "وَأَنزَلْنَا إِلَيْكَ الذِّكْرَ لِتُبَيِّنَ لِلنَّاسِ مَا نُزِّلَ إِلَيْهِمْ وَلَعَلَّهُمْ يَتَفَكَّرُونَ", translation: "And We revealed to you the message that you may make clear to the people what was sent down to them and that they might give thought.", ref: "Surah An-Nahl 16:44" },
  "21:50": { arabic: "وَهَٰذَا ذِكْرٌ مُّبَارَكٌ أَنزَلْنَاهُ ۚ أَفَأَنتُمْ لَهُ مُنكِرُونَ", translation: "And this is a blessed reminder which We have sent down. Then are you to reject it?", ref: "Surah Al-Anbiya 21:50" },
  "24:32": { arabic: "وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ ۚ إِن يَكُونُوا فُقَرَاءَ يُغْنِهِمُ اللَّهُ مِن فَضْلِهِ", translation: "And marry the unmarried among you and the righteous among your male slaves and female slaves. If they should be poor, Allah will enrich them from His bounty.", ref: "Surah An-Nur 24:32" },
  "33:56": { arabic: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا", translation: "Indeed, Allah and His angels send blessings upon the Prophet. O you who have believed, ask blessing upon him and ask for his peace.", ref: "Surah Al-Ahzab 33:56" },
  "35:31": { arabic: "وَالَّذِي أَوْحَيْنَا إِلَيْكَ مِنَ الْكِتَابِ هُوَ الْحَقُّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ", translation: "And that which We have revealed to you of the Book is the truth, confirming what was before it.", ref: "Surah Fatir 35:31" },
  "38:1": { arabic: "ص ۚ وَالْقُرْآنِ ذِي الذِّكْرِ", translation: "Sad. By the Quran containing reminder.", ref: "Surah Sad 38:1" },
  "54:22": { arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ", translation: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?", ref: "Surah Al-Qamar 54:22" },
  "54:32": { arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ", translation: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?", ref: "Surah Al-Qamar 54:32" },
  "54:40": { arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ", translation: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?", ref: "Surah Al-Qamar 54:40" },
  "58:3": { arabic: "وَالَّذِينَ يُظَاهِرُونَ مِن نِّسَائِهِمْ ثُمَّ يَعُودُونَ لِمَا قَالُوا فَتَحْرِيرُ رَقَبَةٍ مِّن قَبْلِ أَن يَتَمَاسَّا ۚ ذَٰلِكُم تُوعَظُونَ بِهِ", translation: "And those who pronounce zihar from their wives and then wish to go back on what they said — then there must be the freeing of a slave before they touch one another. That is what you are admonished thereby.", ref: "Surah Al-Mujadila 58:3" },
  "61:14": { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا أَنصَارَ اللَّهِ كَمَا قَالَ عِيسَى ابْنُ مَرْيَمَ لِلْحَوَارِيِّينَ مَنْ أَنصَارِي إِلَى اللَّهِ", translation: "O you who have believed, be supporters of Allah, as when Jesus, the son of Mary, said to the disciples: Who are my supporters for Allah?", ref: "Surah As-Saf 61:14" },
  "76:2": { arabic: "إِنَّا خَلَقْنَا الْإِنسَانَ مِن نُّطْفَةٍ أَمْشَاجٍ نَّبْتَلِيهِ فَجَعَلْنَاهُ سَمِيعًا بَصِيرًا", translation: "Indeed, We created man from a sperm-drop mixture that We may try him; and We made him hearing and seeing.", ref: "Surah Al-Insan 76:2" },
  "80:13": { arabic: "فِي صُحُفٍ مُّكَرَّمَةٍ", translation: "In honored sheets of Scripture.", ref: "Surah Abasa 80:13" },
  "80:15": { arabic: "بِأَيْدِي سَفَرَةٍ", translation: "By the hands of messenger-scribes.", ref: "Surah Abasa 80:15" },
  "5:116": {
    arabic: "وَإِذْ قَالَ اللَّهُ يَا عِيسَى ابْنَ مَرْيَمَ أَأَنتَ قُلْتَ لِلنَّاسِ اتَّخِذُونِي وَأُمِّيَ إِلَٰهَيْنِ مِن دُونِ اللَّهِ ۖ قَالَ سُبْحَانَكَ مَا يَكُونُ لِي أَنْ أَقُولَ مَا لَيْسَ لِي بِحَقٍّ",
    translation: "And when Allah will say, O Jesus son of Mary, did you say to the people, Take me and my mother as deities besides Allah? He will say, Exalted are You! It was not for me to say that to which I have no right.",
    ref: "Surah Al-Ma'idah 5:116"
  },
  "6:101": {
    arabic: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ ۖ أَنَّىٰ يَكُونُ لَهُ وَلَدٌ وَلَمْ تَكُن لَّهُ صَاحِبَةٌ ۖ وَخَلَقَ كُلَّ شَيْءٍ",
    translation: "Originator of the heavens and the earth. How could He have a son when He does not have a companion, and He created all things?",
    ref: "Surah Al-An'am 6:101"
  },
  "4:79": { arabic: "مَّا أَصَابَكَ مِنْ حَسَنَةٍ فَمِنَ اللَّهِ ۖ وَمَا أَصَابَكَ مِن سَيِّئَةٍ فَمِن نَّفْسِكَ", translation: "Whatever good reaches you is from Allah, and whatever harm reaches you is from yourself.", ref: "Surah An-Nisa 4:79" },
  "4:165": { arabic: "رُّسُلًا مُّبَشِّرِينَ وَمُنذِرِينَ لِئَلَّا يَكُونَ لِلنَّاسِ عَلَى اللَّهِ حُجَّةٌ بَعْدَ الرُّسُلِ", translation: "Messengers as bringers of good tidings and as warners, so that mankind will have no argument against Allah after the messengers.", ref: "Surah An-Nisa 4:165" },
  "6:59": { arabic: "وَعِندَهُ مَفَاتِحُ الْغَيْبِ لَا يَعْلَمُهَا إِلَّا هُوَ ۚ وَيَعْلَمُ مَا فِي الْبَرِّ وَالْبَحْرِ ۚ وَمَا تَسْقُطُ مِن وَرَقَةٍ إِلَّا يَعْلَمُهَا", translation: "And with Him are the keys of the unseen; none knows them except Him. He knows what is on the land and in the sea. Not a leaf falls but that He knows it.", ref: "Surah Al-An'am 6:59" },
  "7:187": { arabic: "يَسْأَلُونَكَ عَنِ السَّاعَةِ أَيَّانَ مُرْسَاهَا ۖ قُلْ إِنَّمَا عِلْمُهَا عِندَ رَبِّي ۖ لَا يُجَلِّيهَا لِوَقْتِهَا إِلَّا هُوَ", translation: "They ask you about the Hour, when will it arrive? Say, its knowledge is only with my Lord. None will reveal its time except Him.", ref: "Surah Al-A'raf 7:187" },
  "57:3": { arabic: "هُوَ ٱلْأَوَّلُ وَٱلْءَاخِرُ وَٱلظَّٰهِرُ وَٱلْبَاطِنُ ۖ وَهُوَ بِكُلِّ شَىْءٍ عَلِيمٌ", translation: "He is the First and the Last, the Manifest and the Hidden, and He has full knowledge of all things.", ref: "Surah Al-Hadid 57:3" },
  "7:33": { arabic: "وَأَن تَقُولُوا عَلَى اللَّهِ مَا لَا تَعْلَمُونَ", translation: "And do not say about Allah that which you do not know.", ref: "Surah Al-A'raf 7:33" },
  "31:34": { arabic: "وَمَا تَدْرِي نَفْسٌ مَّاذَا تَكْسِبُ غَدًا ۖ وَمَا تَدْرِي نَفْسٌ بِأَيِّ أَرْضٍ تَمُوتُ", translation: "And no soul knows what it will earn tomorrow, and no soul knows in what land it will die.", ref: "Surah Luqman 31:34" },
  "47:31": { arabic: "وَلَنَبْلُوَنَّكُمْ حَتَّىٰ نَعْلَمَ الْمُجَاهِدِينَ مِنكُمْ وَالصَّابِرِينَ", translation: "And We will surely test you until We make evident those who strive among you and the patient.", ref: "Surah Muhammad 47:31" }
};

const bibleDB = {
  "2 Kings 8 verse 26": { ref: "2 Kings 8:26", text: "Two and twenty years old was Ahaziah when he began to reign; and he reigned one year in Jerusalem." },
  "2 Chronicles 22 verse 2": { ref: "2 Chronicles 22:2", text: "Forty and two years old was Ahaziah when he began to reign, and he reigned one year in Jerusalem." },
  "2 Chronicles 21 verse 20": { ref: "2 Chronicles 21:20", text: "Thirty and two years old was he when he began to reign, and he reigned in Jerusalem eight years, and departed without being desired." },
  "2 Kings 24 verse 8": { ref: "2 Kings 24:8", text: "Jehoiachin was eighteen years old when he began to reign, and he reigned in Jerusalem three months." },
  "2 Chronicles 36 verse 9": { ref: "2 Chronicles 36:9", text: "Jehoiachin was eight years old when he began to reign, and he reigned three months and ten days in Jerusalem." },
  "2 Samuel 24 verse 9": { ref: "2 Samuel 24:9", text: "...there were in Israel eight hundred thousand valiant men that drew the sword; and the men of Judah were five hundred thousand men." },
  "1 Chronicles 21 verse 5": { ref: "1 Chronicles 21:5", text: "And all they of Israel were a thousand thousand and an hundred thousand men that drew sword: and Judah was four hundred threescore and ten thousand men that drew sword." },
  "2 Samuel 24 verse 13": { ref: "2 Samuel 24:13", text: "Shall seven years of famine come unto thee in thy land? or wilt thou flee three months before thine enemies...?" },
  "1 Chronicles 21 verse 12": { ref: "1 Chronicles 21:12", text: "Either three years' famine; or three months to be destroyed before thy foes...; or else three days the sword of the LORD..." },
  "1 Kings 4 verse 26": { ref: "1 Kings 4:26", text: "And Solomon had forty thousand stalls of horses for his chariots, and twelve thousand horsemen." },
  "2 Chronicles 9 verse 25": { ref: "2 Chronicles 9:25", text: "And Solomon had four thousand stalls for horses and chariots, and twelve thousand horsemen..." },
  "2 Samuel 21 verse 19": { ref: "2 Samuel 21:19 — KJV adds the italic words 'the brother of'; the Hebrew reads simply 'slew Goliath the Gittite'", text: "...Elhanan the son of Jaareoregim, a Bethlehemite, slew the brother of Goliath the Gittite, the staff of whose spear was like a weaver's beam." },
  "1 Chronicles 20 verse 5": { ref: "1 Chronicles 20:5", text: "...Elhanan the son of Jair slew Lahmi the brother of Goliath the Gittite, whose spear staff was like a weaver's beam." },
  "1 Samuel 15 verse 11": { ref: "1 Samuel 15:11", text: "It repenteth me that I have set up Saul to be king: for he is turned back from following me, and hath not performed my commandments." },
  "1 Samuel 15 verse 35": { ref: "1 Samuel 15:35", text: "...and the LORD repented that he had made Saul king over Israel." },
  "1 Samuel 15 verse 29": { ref: "1 Samuel 15:29", text: "And also the Strength of Israel will not lie nor repent: for he is not a man, that he should repent." },
  "Proverbs 26 verse 4": { ref: "Proverbs 26:4", text: "Answer not a fool according to his folly, lest thou also be like unto him." },
  "Proverbs 26 verse 5": { ref: "Proverbs 26:5", text: "Answer a fool according to his folly, lest he be wise in his own conceit." },
  "1 Samuel 16 verses 21 to 23": { ref: "1 Samuel 16:21-23", text: "And David came to Saul, and stood before him: and he loved him greatly; and he became his armourbearer." },
  "1 Samuel 17 verses 55 to 58": { ref: "1 Samuel 17:55-58", text: "...Saul said unto Abner...Whose son is this youth? And Abner said, As thy soul liveth, O king, I cannot tell." },
  "2 Samuel 24 verse 1": { ref: "2 Samuel 24:1", text: "And again the anger of the LORD was kindled against Israel, and he moved David against them to say, Go, number Israel and Judah." },
  "1 Chronicles 21 verse 1": { ref: "1 Chronicles 21:1", text: "And Satan stood up against Israel, and provoked David to number Israel." },
  "Genesis 1 verse 27": { ref: "Genesis 1:27", text: "So God created man in his own image...male and female created he them." },
  "Genesis 1 verse 26": { ref: "Genesis 1:26", text: "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth." },
  "Genesis 3 verse 22": { ref: "Genesis 3:22", text: "And the LORD God said, Behold, the man is become as one of us, to know good and evil: and now, lest he put forth his hand, and take also of the tree of life, and eat, and live for ever:" },
  "Genesis 11 verse 5": { ref: "Genesis 11:5", text: "And the LORD came down to see the city and the tower, which the children of men builded." },
  "Genesis 11 verse 7": { ref: "Genesis 11:7", text: "Go to, let us go down, and there confound their language, that they may not understand one another's speech." },
  "Isaiah 6 verse 8": { ref: "Isaiah 6:8", text: "Also I heard the voice of the Lord, saying, Whom shall I send, and who will go for us? Then said I, Here am I; send me." },
  "Isaiah 44 verse 24": { ref: "Isaiah 44:24", text: "Thus saith the LORD, thy redeemer, and he that formed thee from the womb, I am the LORD that maketh all things; that stretcheth forth the heavens alone; that spreadeth abroad the earth by myself;" },
  "Deuteronomy 6 verse 4": { ref: "Deuteronomy 6:4", text: "Hear, O Israel: The LORD our God is one LORD:" },
  "Genesis 2 verse 7": { ref: "Genesis 2:7", text: "And the LORD God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul." },
  "Genesis 2 verse 9": { ref: "Genesis 2:9", text: "And out of the ground made the LORD God to grow every tree that is pleasant to the sight, and good for food..." },
  "Genesis 2 verse 19": { ref: "Genesis 2:19", text: "And out of the ground the LORD God formed every beast of the field, and every fowl of the air; and brought them unto Adam to see what he would call them." },
  "Genesis 6 verses 19 to 20": { ref: "Genesis 6:19-20", text: "And of every living thing of all flesh, two of every sort shalt thou bring into the ark, to keep them alive with thee; they shall be male and female." },
  "Genesis 7 verses 2 to 3": { ref: "Genesis 7:2-3", text: "Of every clean beast thou shalt take to thee by sevens, the male and his female: and of beasts that are not clean by two, the male and his female." },
  "Genesis 22 verse 2": { ref: "Genesis 22:2", text: "Take now thy son, thine only son Isaac, whom thou lovest, and get thee into the land of Moriah; and offer him there for a burnt offering." },
  "Genesis 16 verse 16": { ref: "Genesis 16:16", text: "And Abram was fourscore and six years old, when Hagar bare Ishmael to Abram." },
  "Genesis 17 verse 18": { ref: "Genesis 17:18", text: "And Abraham said unto God, O that Ishmael might live before thee!" },
  "John 1 verse 18": { ref: "John 1:18", text: "No man hath seen God at any time; the only begotten Son, which is in the bosom of the Father, he hath declared him." },
  "Exodus 33 verse 20": { ref: "Exodus 33:20", text: "And he said, Thou canst not see my face: for there shall no man see me, and live." },
  "Genesis 32 verse 30": { ref: "Genesis 32:30", text: "And Jacob called the name of the place Peniel: for I have seen God face to face, and my life is preserved." },
  "Exodus 33 verse 11": { ref: "Exodus 33:11", text: "And the LORD spake unto Moses face to face, as a man speaketh unto his friend." },
  "Isaiah 6 verse 1": { ref: "Isaiah 6:1", text: "In the year that king Uzziah died I saw also the Lord sitting upon a throne, high and lifted up, and his train filled the temple." },
  "James 1 verse 13": { ref: "James 1:13", text: "Let no man say when he is tempted, I am tempted of God: for God cannot be tempted with evil, neither tempteth he any man." },
  "Genesis 22 verse 1": { ref: "Genesis 22:1", text: "And it came to pass after these things, that God did tempt Abraham, and said unto him, Abraham: and he said, Behold, here I am." },
  "Exodus 20 verse 5": { ref: "Exodus 20:5", text: "...for I the LORD thy God am a jealous God, visiting the iniquity of the fathers upon the children unto the third and fourth generation of them that hate me." },
  "Ezekiel 18 verse 20": { ref: "Ezekiel 18:20", text: "The soul that sinneth, it shall die. The son shall not bear the iniquity of the father, neither shall the father bear the iniquity of the son." },
  "Deuteronomy 24 verse 16": { ref: "Deuteronomy 24:16", text: "The fathers shall not be put to death for the children, neither shall the children be put to death for the fathers: every man shall be put to death for his own sin." },
  "Matthew 28 verse 2": { ref: "Matthew 28:2", text: "And, behold, there was a great earthquake: for the angel of the Lord descended from heaven, and came and rolled back the stone from the door, and sat upon it." },
  "Mark 16 verse 5": { ref: "Mark 16:5", text: "And entering into the sepulchre, they saw a young man sitting on the right side, clothed in a long white garment; and they were affrighted." },
  "Luke 24 verse 4": { ref: "Luke 24:4", text: "And...as they were much perplexed thereabout, behold, two men stood by them in shining garments." },
  "John 20 verse 12": { ref: "John 20:12", text: "And seeth two angels in white sitting, the one at the head, and the other at the feet, where the body of Jesus had lain." },
  "John 20 verse 1": { ref: "John 20:1", text: "The first day of the week cometh Mary Magdalene early, when it was yet dark, unto the sepulchre, and seeth the stone taken away from the sepulchre." },
  "Matthew 28 verse 1": { ref: "Matthew 28:1", text: "...came Mary Magdalene and the other Mary to see the sepulchre." },
  "Mark 16 verse 1": { ref: "Mark 16:1", text: "...Mary Magdalene, and Mary the mother of James, and Salome, had bought sweet spices, that they might come and anoint him." },
  "Luke 24 verse 10": { ref: "Luke 24:10", text: "It was Mary Magdalene, and Joanna, and Mary the mother of James, and other women that were with them, which told these things unto the apostles." },
  "Mark 16 verse 4": { ref: "Mark 16:4", text: "And when they looked, they saw that the stone was rolled away: for it was very great." },
  "Luke 24 verse 2": { ref: "Luke 24:2", text: "And they found the stone rolled away from the sepulchre." },
  "Mark 16 verse 2": { ref: "Mark 16:2", text: "And very early in the morning the first day of the week, they came unto the sepulchre at the rising of the sun." },
  "Acts 9 verse 7": { ref: "Acts 9:7", text: "And the men which journeyed with him stood speechless, hearing a voice, but seeing no man." },
  "Acts 22 verse 9": { ref: "Acts 22:9", text: "And they that were with me saw indeed the light, and were afraid; but they heard not the voice of him that spake to me." },
  "Acts 26 verse 14": { ref: "Acts 26:14", text: "And when we were all fallen to the earth, I heard a voice speaking unto me..." },
  "Matthew 27 verse 5": { ref: "Matthew 27:5", text: "And he cast down the pieces of silver in the temple, and departed, and went and hanged himself." },
  "Matthew 27 verse 8": { ref: "Matthew 27:8", text: "Wherefore that field was called, The field of blood, unto this day." },
  "Acts 1 verse 18": { ref: "Acts 1:18", text: "Now this man purchased a field with the reward of iniquity; and falling headlong, he burst asunder in the midst, and all his bowels gushed out." },
  "Acts 1 verse 19": { ref: "Acts 1:19", text: "And it was known unto all the dwellers at Jerusalem; insomuch as that field is called in their proper tongue, Aceldama, that is to say, The field of blood." },
  "Matthew 27 verses 6 to 7": { ref: "Matthew 27:6-7", text: "And the chief priests took the silver pieces, and said, It is not lawful for to put them into the treasury, because it is the price of blood. And they took counsel, and bought with them the potter's field, to bury strangers in." },
  "Mark 15 verse 25": { ref: "Mark 15:25", text: "And it was the third hour, and they crucified him." },
  "John 19 verse 14": { ref: "John 19:14", text: "And it was the preparation of the passover, and about the sixth hour: and he saith unto the Jews, Behold your King!" },
  "Mark 14 verses 12 to 16": { ref: "Mark 14:12-16", text: "And the first day of unleavened bread, when they killed the passover, his disciples said unto him, Where wilt thou that we...prepare that thou mayest eat the passover?" },
  "Matthew 27 verse 32": { ref: "Matthew 27:32", text: "And as they came out, they found a man of Cyrene, Simon by name: him they compelled to bear his cross." },
  "Mark 15 verse 21": { ref: "Mark 15:21", text: "And they compel one Simon a Cyrenian, who passed by...to bear his cross." },
  "Luke 23 verse 26": { ref: "Luke 23:26", text: "And...they laid hold upon one Simon, a Cyrenian...and on him they laid the cross, that he might bear it after Jesus." },
  "John 19 verse 17": { ref: "John 19:17", text: "And he bearing his cross went forth into a place called the place of a skull, which is called in the Hebrew Golgotha." },
  "Matthew 27 verse 46": { ref: "Matthew 27:46", text: "...Jesus cried with a loud voice, saying, Eli, Eli, lama sabachthani? that is to say, My God, my God, why hast thou forsaken me?" },
  "Mark 15 verse 34": { ref: "Mark 15:34", text: "...Jesus cried with a loud voice, saying, Eloi, Eloi, lama sabachthani?...My God, my God, why hast thou forsaken me?" },
  "Luke 23 verse 46": { ref: "Luke 23:46", text: "And when Jesus had cried with a loud voice, he said, Father, into thy hands I commend my spirit: and...he gave up the ghost." },
  "John 19 verse 30": { ref: "John 19:30", text: "...he said, It is finished: and he bowed his head, and gave up the ghost." },
  "Luke 2 verse 2": { ref: "Luke 2:2", text: "(And this taxing was first made when Cyrenius [Quirinius] was governor of Syria.)" },
  "Matthew 2 verses 13 to 16": { ref: "Matthew 2:13-16", text: "Then Herod...slew all the children that were in Bethlehem, and in all the coasts thereof, from two years old and under..." },
  "Luke 2 verse 39": { ref: "Luke 2:39", text: "And when they had performed all things according to the law of the Lord, they returned into Galilee, to their own city Nazareth." },
  "Matthew 1 verse 16": { ref: "Matthew 1:16", text: "And Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ." },
  "Luke 3 verse 23": { ref: "Luke 3:23", text: "And Jesus...being (as was supposed) the son of Joseph, which was the son of Heli." },
  "James 2 verse 24": { ref: "James 2:24", text: "Ye see then how that by works a man is justified, and not by faith only." },
  "Romans 3 verse 28": { ref: "Romans 3:28", text: "Therefore we conclude that a man is justified by faith without the deeds of the law." },
  "Galatians 2 verse 16": { ref: "Galatians 2:16", text: "Knowing that a man is not justified by the works of the law, but by the faith of Jesus Christ...for by the works of the law shall no flesh be justified." },
  "2 Timothy 3 verse 16": { ref: "2 Timothy 3:16", text: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness." },
  "1 Corinthians 7 verse 12": { ref: "1 Corinthians 7:12", text: "But to the rest speak I, not the Lord: If any brother hath a wife that believeth not...let him not put her away." },
  "1 Corinthians 7 verse 25": { ref: "1 Corinthians 7:25", text: "Now concerning virgins I have no commandment of the Lord: yet I give my judgment, as one that hath obtained mercy of the Lord to be faithful." },
  "2 Corinthians 11 verse 17": { ref: "2 Corinthians 11:17", text: "That which I speak, I speak it not after the Lord, but as it were foolishly, in this confidence of boasting." }
};

const BIBLE_BOOK_PRECEDER = /(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)\s+$/;

function linkVerseRefs(text) {
  // Guard: if the text already contains verse-exp blocks or verse-ref-btn buttons,
  // it was hand-authored with expandable cards — don't double-wrap refs inside it.
  // We still linkify refs in the plain claim text and simple rebuttals.
  if (text.includes('verse-exp') || text.includes('verse-ref-btn')) {
    // Only linkify refs that appear in plain text segments (outside any HTML tag)
    // Strategy: split on HTML tags, linkify only the text nodes, reassemble
    return text.replace(/(<[^>]+>)|(\(?\b(\d+:\d+(?:–\d+)?)\b\)?)/g, (match, tag, full, ref, offset, str) => {
      if (tag) return tag; // leave HTML tags untouched
      if (!ref) return match;
      if (BIBLE_BOOK_PRECEDER.test(str.slice(Math.max(0, offset - 20), offset))) return match;
      const cleanRef = ref.split('–')[0];
      if (verseDB[cleanRef]) {
        return `<button class="verse-ref-btn" onclick="openVersePopup('${cleanRef}');event.stopPropagation()">📖 ${full}</button>`;
      }
      return match;
    });
  }
  // Simple rebuttal — linkify all verse refs normally
  return text.replace(/\(?\b(\d+:\d+(?:–\d+)?)\b\)?/g, (match, ref, offset, str) => {
    if (BIBLE_BOOK_PRECEDER.test(str.slice(Math.max(0, offset - 20), offset))) return match;
    const cleanRef = ref.split('–')[0];
    if (verseDB[cleanRef]) {
      return `<button class="verse-ref-btn" onclick="openVersePopup('${cleanRef}');event.stopPropagation()">📖 ${match}</button>`;
    }
    return match;
  });
}

function linkBibleRefs(text) {
  const keys = Object.keys(bibleDB).sort((a, b) => b.length - a.length);
  const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const swaps = [];
  keys.forEach((phrase, i) => {
    // Negative lookahead on a trailing digit stops "verse 1" from matching
    // inside "verse 19" when only the shorter phrase exists as a bibleDB key.
    const re = new RegExp(escapeRegex(phrase) + '(?!\\d)');
    if (re.test(text)) {
      const token = '\0B' + i + '\0';
      text = text.replace(new RegExp(escapeRegex(phrase) + '(?!\\d)', 'g'), token);
      swaps.push({ token, phrase });
    }
  });
  swaps.forEach(({ token, phrase }) => {
    const safe = phrase.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const btn = '<button class="verse-ref-btn" onclick="openBiblePopup(\'' + safe + '\');event.stopPropagation()">📖 ' + phrase + '</button>';
    text = text.split(token).join(btn);
  });
  return text;
}

function openVersePopup(ref) {
  const verse = verseDB[ref];
  if (!verse) return;
  const ar = document.getElementById('versePopupArabic');
  ar.style.display = '';
  ar.textContent = verse.arabic;
  document.getElementById('versePopupEyebrow').textContent = '◈ Quranic Reference';
  document.getElementById('versePopupTranslation').textContent = '"' + verse.translation + '"';
  document.getElementById('versePopupRef').textContent = '— ' + verse.ref;
  document.getElementById('versePopup').classList.add('visible');
}

function closeVersePopup() {
  document.getElementById('versePopup').classList.remove('visible');
}

function closeVersePopupOutside(e) {
  if (e.target === document.getElementById('versePopup')) closeVersePopup();
}

function openBiblePopup(key) {
  const v = bibleDB[key];
  if (!v) return;
  const ar = document.getElementById('versePopupArabic');
  ar.textContent = '';
  ar.style.display = 'none';
  document.getElementById('versePopupEyebrow').textContent = '◈ Biblical Reference';
  document.getElementById('versePopupTranslation').textContent = '"' + v.text + '"';
  document.getElementById('versePopupRef').textContent = '— ' + v.ref + ' (KJV)';
  document.getElementById('versePopup').classList.add('visible');
}

function toggleVerse(headerEl) {
  headerEl.parentElement.classList.toggle('open');
}
function isMember(){ return typeof window.hasAccess === 'function' && window.hasAccess(); }
function openModal(){ window.open('https://alhaqq.it.com/landing.html#pricing', '_blank', 'noopener'); }

let ttsAudio = null;        // current Audio element
let ttsActive = false;
let ttsPaused = false;
let ttsEntryId = null;
let ttsProgressTimer = null;
const TTS_VOICE = 'adam';   // 'adam' or 'christopher'

function stripHtmlForSpeech(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  tmp.querySelectorAll('script,style').forEach(el => el.remove());
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

function buildReadText(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return '';
  const claimText = stripHtmlForSpeech(entry.claim);
  const rebuttalText = stripHtmlForSpeech(entry.rebuttal);
  const verseText = entry.verse
    ? `Quranic Foundation. ${entry.verse.translation}. ${entry.verse.ref}.`
    : '';
  return `${entry.myth}. The claim: ${claimText}. The rebuttal: ${rebuttalText}. ${verseText}`;
}

async function startReader(id, event) {
  event.stopPropagation();
  if (ttsActive) stopReader();

  const entry = entries.find(e => e.id === id);
  if (!entry) return;

  const text = buildReadText(id);
  if (!text) return;

  ttsEntryId = id;
  ttsActive = true;
  ttsPaused = false;

  document.getElementById('readerTitle').textContent = entry.myth;
  document.getElementById('readerBar').classList.add('visible');
  document.getElementById('readerPlayPause').textContent = '⏳ Loading…';
  document.getElementById('readerPlayPause').classList.add('active');
  document.getElementById('readerProgress').style.transform = 'scaleX(0)';

  try {
    const res = await fetch('/.netlify/functions/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.slice(0, 5000), voice: TTS_VOICE })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'TTS request failed');
    }

    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    ttsAudio = new Audio(audioUrl);
    ttsAudio.playbackRate = 1.0;

    // Progress bar via timeupdate
    ttsAudio.addEventListener('timeupdate', () => {
      if (ttsAudio.duration) {
        const pct = ttsAudio.currentTime / ttsAudio.duration;
        document.getElementById('readerProgress').style.transform = 'scaleX(' + pct + ')';
      }
    });

    ttsAudio.addEventListener('ended', () => {
      document.getElementById('readerProgress').style.transform = 'scaleX(1)';
      setTimeout(() => stopReader(), 800);
    });

    ttsAudio.addEventListener('error', () => stopReader());

    document.getElementById('readerPlayPause').textContent = '⏸ Pause';
    await ttsAudio.play();

  } catch (err) {
    console.error('[TTS]', err.message);
    // Graceful fallback to browser speech
    stopReader();
    const utt = new SpeechSynthesisUtterance(text.slice(0, 3000));
    utt.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('en')) || null;
    if (preferred) utt.voice = preferred;

    ttsActive = true;
    document.getElementById('readerTitle').textContent = entry.myth;
    document.getElementById('readerBar').classList.add('visible');
    document.getElementById('readerPlayPause').textContent = '⏸ Pause';
    document.getElementById('readerPlayPause').classList.add('active');

    let wordCount = text.split(/\s+/).length, wordIdx = 0;
    utt.onboundary = (e) => {
      if (e.name === 'word') {
        wordIdx++;
        document.getElementById('readerProgress').style.transform = 'scaleX(' + Math.min(wordIdx / wordCount, 1) + ')';
      }
    };
    utt.onend = () => { document.getElementById('readerProgress').style.transform = 'scaleX(1)'; setTimeout(stopReader, 800); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  }
}

function togglePlayPause() {
  if (!ttsActive) return;
  if (ttsAudio) {
    if (ttsPaused) {
      ttsAudio.play();
      ttsPaused = false;
      document.getElementById('readerPlayPause').textContent = '⏸ Pause';
      document.getElementById('readerPlayPause').classList.add('active');
    } else {
      ttsAudio.pause();
      ttsPaused = true;
      document.getElementById('readerPlayPause').textContent = '▶ Resume';
      document.getElementById('readerPlayPause').classList.remove('active');
    }
  } else {
    // Browser speech fallback controls
    if (ttsPaused) {
      window.speechSynthesis.resume();
      ttsPaused = false;
      document.getElementById('readerPlayPause').textContent = '⏸ Pause';
      document.getElementById('readerPlayPause').classList.add('active');
    } else {
      window.speechSynthesis.pause();
      ttsPaused = true;
      document.getElementById('readerPlayPause').textContent = '▶ Resume';
      document.getElementById('readerPlayPause').classList.remove('active');
    }
  }
}

function stopReader() {
  if (ttsAudio) { ttsAudio.pause(); ttsAudio.src = ''; ttsAudio = null; }
  window.speechSynthesis.cancel();
  ttsActive = false;
  ttsPaused = false;
  ttsEntryId = null;
  document.getElementById('readerBar').classList.remove('visible');
  document.getElementById('readerPlayPause').classList.remove('active');
}
function renderClipSection(entry) {
  if (!entry.clipId) return '';
  const ids = Array.isArray(entry.clipId) ? entry.clipId : [entry.clipId];
  const cards = ids.map((clipId, i) => `
    <div class="clip-card-wrap">
      ${ids.length > 1 ? `<div class="clip-card-index">Clip ${i + 1}</div>` : ''}
      <div class="clip-placeholder" data-clip-id="${clipId}" onclick="loadClipCard(this)">
        <div class="clip-placeholder-play">▶</div>
        <div class="clip-placeholder-text">Tap to play</div>
      </div>
    </div>
  `).join('');
  return `
    <div class="clip-section">
      <div class="clip-section-label">▶ Watch This Used Live</div>
      ${cards}
    </div>
  `;
}

function ensureTikTokScript() {
  if (window.tiktokEmbed?.lib?.render) {
    window.tiktokEmbed.lib.render();
    return;
  }
  const old = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
  if (old) old.remove();
  const s = document.createElement('script');
  s.src = 'https://www.tiktok.com/embed.js';
  s.async = true;
  document.body.appendChild(s);
}

function loadClipCard(el) {
  if (!el || el.dataset.loaded === 'true') return;
  el.dataset.loaded = 'true';
  const clipId = el.dataset.clipId;
  const videoUrl = `https://www.tiktok.com/@builtongrit1/video/${clipId}`;
  const wrap = document.createElement('div');
  wrap.className = 'clip-embed-wrap';
  wrap.innerHTML = `<blockquote class="tiktok-embed" cite="${videoUrl}" data-video-id="${clipId}" style="max-width: 340px; min-width: 288px;"><section></section></blockquote>`;
  el.replaceWith(wrap);
  ensureTikTokScript();
}

function observeClipPlaceholders(containerEl) {
  const placeholders = containerEl.querySelectorAll('.clip-placeholder:not([data-loaded="true"])');
  if (!placeholders.length) return;
  const io = new IntersectionObserver((ents, observer) => {
    ents.forEach(en => {
      if (en.isIntersecting) {
        loadClipCard(en.target);
        observer.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  placeholders.forEach(p => io.observe(p));
}

function buildEntryBodyHTML(entry) {
  const claimHtml = linkBibleRefs(linkVerseRefs(entry.claim || ''));

  if (entry.interactive) {
    const subtitle = entry.interactiveSubtitle || 'Tap to open the interactive walkthrough.';
    return `
      ${entry.claim ? `
      <div class="section-label">The Claim</div>
      <div class="myth-claim">"${claimHtml}"</div>
      ` : ''}
      <div class="section-label" style="margin-top:1.4rem;">Interactive Walkthrough</div>
      <div style="color:var(--text-dim);font-size:.85rem;font-style:italic;line-height:1.6;margin-bottom:1.2rem;">${subtitle}</div>
      <button class="entry-launch-overlay-btn" onclick="openInteractiveEntry(${entry.id})">◈ Open the interactive walkthrough</button>
    `;
  }

  const rebuttalHtml = linkBibleRefs(linkVerseRefs(entry.rebuttal || ''));

  return `
    <button class="tts-trigger" onclick="startReader(${entry.id}, event)">
      <span class="tts-trigger-icon">◈</span> Listen to this rebuttal
    </button>
    <div class="section-label" style="margin-top:1.4rem;">The Claim</div>
    <div class="myth-claim">"${claimHtml}"</div>
    ${entry.interactiveInline ? `
    <button class="entry-launch-overlay-btn" onclick="openInlineOverlay(${entry.id})">⚖ OPEN THE PROOF · watch 112.5% fall apart</button>
    ` : ''}
    <div class="section-label">The Rebuttal</div>
    <div class="rebuttal-text">${rebuttalHtml}</div>
    ${entry.verse ? `
    <div class="section-label">Quranic Foundation</div>
    <div class="quran-verse">
      <div class="quran-arabic">${entry.verse.arabic}</div>
      <div class="quran-translation">"${entry.verse.translation}"</div>
      <div class="quran-ref">— ${entry.verse.ref}</div>
    </div>` : ''}
    ${renderClipSection(entry)}
  `;
}

function openInteractiveEntry(id) {
  if (id === 38) { openSalatWalkthrough(); return; }
  if (id === 40) { window.open('cross-examination.html', '_blank'); return; }
  openTreeModal();
}

function openInlineOverlay(id) {
  if (id === 36) { openInheritanceOverlay(); return; }
}

function openTreeModal() {
  const modal = document.getElementById('covenantTreeModal');
  const frame = document.getElementById('treeFrame');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Load the tree only on first open (lazy load)
  if (!frame.getAttribute('data-loaded')) {
    frame.src = 'prophecy-tree-v5.html';
    frame.setAttribute('data-loaded', 'true');
  }
}

function closeTreeModal() {
  document.getElementById('covenantTreeModal').style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  const versePopup = document.getElementById('versePopup');
  const tree = document.getElementById('covenantTreeModal');
  const salat = document.getElementById('salatWalkthrough');
  const inherit = document.getElementById('inheritOverlay');
  const daraba = document.getElementById('darabaGameOverlay');
  let handled = false;
  if (versePopup && versePopup.classList.contains('visible')) { closeVersePopup(); handled = true; }
  if (tree && tree.style.display === 'flex') { closeTreeModal(); handled = true; }
  if (salat && salat.classList.contains('visible')) { closeSalatWalkthrough(); handled = true; }
  if (inherit && inherit.classList.contains('visible')) { closeInheritanceOverlay(); handled = true; }
  if (daraba && daraba.classList.contains('visible')) { closeDarabaGame(); handled = true; }
  if (handled) e.stopImmediatePropagation();
});

(function () {
  const walkSteps = [
    { n:1, title:"PURIFY", pose:"wudu",
      english:"Before you pray, wash. Your face. Your hands up to the elbows. Wipe your head. Your feet up to the ankles. That is wudu, and it comes straight from the verse. No water around? Clean earth works. Same verse.",
      arabicKey:"5:6", refs:["5:6"] },
    { n:2, title:"FACE THE HOUSE", pose:"qibla",
      english:"Turn toward the Sacred Mosque in Makkah. It does not matter where on earth you stand. Face it. The Quran itself gives you the direction.",
      arabicKey:"2:144", refs:["2:144"] },
    { n:3, title:"STAND", pose:"stand",
      english:"Stand in front of Allah. Calm. Focused. Devoted. And the Quran names the times of prayer itself: the two ends of the day, the fall of night, the dawn.",
      arabicKey:"2:238", refs:["2:238","11:114","17:78","24:58"] },
    { n:4, title:"RECITE", pose:"stand",
      english:"Recite from the Quran. Whatever is easy for you. Not loud. Not a whisper. A path in between.",
      arabicKey:"17:110", refs:["29:45","73:20","17:110"] },
    { n:5, title:"BOW", pose:"bow",
      english:"Bow. Hands toward your knees, back level. The Quran commands it, and shows the believers doing it together.",
      arabicKey:"22:77", refs:["22:77","2:43"] },
    { n:6, title:"PROSTRATE", pose:"sujud",
      english:"Go down. Forehead to the ground. This is sujud. The Quran calls it the mark of the believers, a trace you carry on your face.",
      arabicKey:"48:29", refs:["22:77","48:29"] },
    { n:7, title:"FINISH AND REMEMBER", pose:"stand",
      english:"When the prayer is done, keep Allah on your tongue and in your chest. Standing. Sitting. Lying down. And prayer is a timed duty, so you will be back.",
      arabicKey:"4:103", refs:["4:103"] }
  ];

  const defendCards = [
    { q:"Where are the rakat numbers?",
      a:"What Allah specified is required. What He named in the Book, you just walked through it. The count He left to the living practice that carried salat from Ibrahim's time to yours, and the Quran proves that practice is ancient: Maryam bowed and prostrated in 3:43, Ibrahim's House hosted those who bow and prostrate in 22:26, all before a single narrator was born. And 2:239 shows the form itself flexes. In danger, pray walking or riding. A prayer that adapts is not a prayer with missing pieces." },
    { q:"The Quran says obey the Messenger, so you need Hadith.",
      a:"Obeying the messenger means obeying what he delivered. His job description is in 5:67: deliver what was sent down to you from your Lord. And 69:44 to 46 is blunt: if he had invented sayings in Allah's name, Allah would have cut his lifeline. So which words carry his authority? The revealed ones. That is the Quran." },
    { q:"How would you even know what bowing and prostrating look like?",
      a:"They are physical words with plain meanings, and the Quran shows entire communities doing them long before Muhammad was born. 19:58: they fell down prostrating and weeping. Nobody needed a book written two centuries later to know what falling on your face means." },
    { q:"The Quran has no prayer times.",
      a:"It names them. 11:114: the two ends of the day and the early night. 17:78: from the sun's decline to the darkness of night, and the dawn recitation. 24:58 names the dawn prayer and the night prayer by name. The full breakdown lives in the prayer times entry in this database." },
    { q:"Wudu needs Hadith for the details.",
      a:"5:6 is a complete instruction. Wash your face, your hands to the elbows, wipe your head, your feet to the ankles. It even covers having no water: use clean earth. And the verse ends with Allah saying He does not want to make things hard for you. The add-ons are optional. The verse is sufficient." }
  ];

  const posesSVG = {
    stand: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="15" y1="170" x2="185" y2="170" stroke="var(--border)" stroke-width="2"/>' +
      '<g fill="none" stroke="var(--gold)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="100" cy="45" r="13"/>' +
      '<line x1="100" y1="58" x2="100" y2="70"/>' +
      '<line x1="80" y1="70" x2="120" y2="70"/>' +
      '<line x1="100" y1="70" x2="100" y2="130"/>' +
      '<line x1="100" y1="130" x2="90" y2="170"/>' +
      '<line x1="100" y1="130" x2="110" y2="170"/>' +
      '<line x1="80" y1="70" x2="75" y2="110"/>' +
      '<line x1="120" y1="70" x2="125" y2="110"/>' +
      '</g></svg>',
    bow: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="15" y1="170" x2="185" y2="170" stroke="var(--border)" stroke-width="2"/>' +
      '<g fill="none" stroke="var(--gold)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="155" cy="100" r="13"/>' +
      '<line x1="148" y1="104" x2="140" y2="105"/>' +
      '<line x1="140" y1="105" x2="80" y2="105"/>' +
      '<line x1="80" y1="105" x2="75" y2="170"/>' +
      '<line x1="80" y1="105" x2="85" y2="170"/>' +
      '<line x1="140" y1="105" x2="145" y2="140"/>' +
      '</g></svg>',
    sujud: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="15" y1="170" x2="185" y2="170" stroke="var(--border)" stroke-width="2"/>' +
      '<g fill="none" stroke="var(--gold)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="150" cy="157" r="13"/>' +
      '<line x1="139" y1="159" x2="100" y2="160"/>' +
      '<line x1="100" y1="160" x2="80" y2="160"/>' +
      '<line x1="139" y1="159" x2="130" y2="168"/>' +
      '<line x1="139" y1="159" x2="165" y2="168"/>' +
      '</g></svg>',
    wudu: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="15" y1="170" x2="185" y2="170" stroke="var(--border)" stroke-width="2"/>' +
      '<g fill="none" stroke="var(--gold)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M 55 122 Q 75 148 95 122"/>' +
      '<path d="M 105 122 Q 125 148 145 122"/>' +
      '</g>' +
      '<g fill="var(--gold)" stroke="none">' +
      '<path d="M 100 52 C 106 52 106 62 100 68 C 94 62 94 52 100 52 Z"/>' +
      '<path d="M 100 67 C 106 67 106 77 100 83 C 94 77 94 67 100 67 Z"/>' +
      '<path d="M 100 82 C 106 82 106 92 100 98 C 94 92 94 82 100 82 Z"/>' +
      '</g></svg>',
    qibla: '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="15" y1="170" x2="185" y2="170" stroke="var(--border)" stroke-width="2"/>' +
      '<g fill="none" stroke="var(--gold)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
      '<polygon points="120,90 160,90 160,140 120,140"/>' +
      '<polygon points="120,90 135,75 175,75 160,90"/>' +
      '<line x1="120" y1="112" x2="160" y2="112" stroke-width="8"/>' +
      '<line x1="20" y1="115" x2="112" y2="115"/>' +
      '<polyline points="102,107 115,115 102,123"/>' +
      '</g></svg>'
  };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function poseSVGHTML(pose) {
    return '<div class="salat-svg-wrap">' + (posesSVG[pose] || posesSVG.stand) + '</div>';
  }

  let salatIdx = 0;
  const totalScreens = walkSteps.length + 2;

  function buildStepScreen(step, i) {
    const refChips = step.refs.map(function (r) { return '<span class="salat-chip">' + esc(r) + '</span>'; }).join('');
    const arabicText = (typeof verseDB !== 'undefined' && verseDB[step.arabicKey]) ? verseDB[step.arabicKey].arabic : '';
    return '<div class="salat-screen" data-idx="' + i + '">' +
      '<div class="salat-step-label">STEP ' + step.n + ' · ' + esc(step.title) + '</div>' +
      poseSVGHTML(step.pose) +
      '<div class="salat-english">' + esc(step.english) + '</div>' +
      '<div class="salat-arabic" dir="rtl">' + arabicText + '</div>' +
      '<div class="salat-chips">' + refChips + '</div>' +
      '</div>';
  }

  function buildOlderScreen(i) {
    return '<div class="salat-screen" data-idx="' + i + '">' +
      '<div class="salat-heading">THIS PRAYER IS OLDER THAN THE BOOKS</div>' +
      '<div class="salat-body-text">Maryam was told to bow and prostrate. Ibrahim purified the House for those who stand, bow, and prostrate. Believers fell down prostrating and weeping when the verses were recited. All of this is in the Quran, describing worship that existed centuries before a single hadith book was written. The form was never missing. It was always in the Book, carried by living practice. The claim assumes prayer was invented by narrators. The Quran says it was inherited from prophets.</div>' +
      '<div class="salat-chips"><span class="salat-chip">3:43</span><span class="salat-chip">22:26</span><span class="salat-chip">19:58</span></div>' +
      '</div>';
  }

  function defendCardHTML(card, i) {
    return '<div class="defend-card" id="defendCard' + i + '">' +
      '<div class="defend-q" onclick="toggleDefendCard(' + i + ')"><span>' + esc(card.q) + '</span><span class="defend-caret">▶</span></div>' +
      '<div class="defend-a" id="defendA' + i + '"><div class="defend-a-inner">' + esc(card.a) + '</div></div>' +
      '</div>';
  }

  function buildDefendScreen(i) {
    let inner;
    if (typeof isMember === 'function' && isMember()) {
      inner = '<div class="salat-defend-list">' + defendCards.map(defendCardHTML).join('') + '</div>';
    } else {
      const lockedRows = defendCards.map(function (card) {
        return '<div class="defend-locked-row">🔒 <span>' + esc(card.q) + '</span></div>';
      }).join('');
      inner = '<div class="salat-defend-list">' + lockedRows + '</div>' +
        '<div class="salat-body-text" style="text-align:center;">Members get the answer script for every objection.</div>' +
        '<button class="salat-nav-btn primary" style="max-width:320px;flex:none;padding:0 1.2rem;" onclick="openModal()">⭐ Unlock Defend This · $2.99/mo</button>';
    }
    return '<div class="salat-screen" data-idx="' + i + '">' +
      '<div class="salat-heading">DEFEND THIS</div>' +
      '<div class="salat-sub">The five comebacks you will hear, and the answer for each.</div>' +
      inner +
      '</div>';
  }

  function renderSalatScreens() {
    let html = '';
    walkSteps.forEach(function (step, i) { html += buildStepScreen(step, i); });
    html += buildOlderScreen(walkSteps.length);
    html += buildDefendScreen(walkSteps.length + 1);
    document.getElementById('salatScreens').innerHTML = html;

    let dots = '';
    for (let i = 0; i < totalScreens; i++) dots += '<span class="salat-dot" data-dot="' + i + '"></span>';
    document.getElementById('salatDots').innerHTML = dots;
  }

  function showSalatScreen(idx) {
    idx = Math.max(0, Math.min(totalScreens - 1, idx));
    document.querySelectorAll('.salat-screen').forEach(function (el) {
      el.classList.toggle('active', parseInt(el.dataset.idx, 10) === idx);
    });

    salatIdx = idx;
    document.querySelectorAll('.salat-dot').forEach(function (el) {
      el.classList.toggle('active', parseInt(el.dataset.dot, 10) === idx);
    });
    document.getElementById('salatBackBtn').disabled = idx === 0;
    document.getElementById('salatNextBtn').style.display = idx === totalScreens - 1 ? 'none' : '';
    document.getElementById('salatScreens').scrollTop = 0;
  }

  window.salatNav = function (dir) { showSalatScreen(salatIdx + dir); };

  window.toggleDefendCard = function (i) {
    document.getElementById('defendCard' + i).classList.toggle('open');
  };

  window.openSalatWalkthrough = function () {
    renderSalatScreens();
    showSalatScreen(0);
    document.getElementById('salatWalkthrough').classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  window.closeSalatWalkthrough = function () {
    document.getElementById('salatWalkthrough').classList.remove('visible');
    document.body.style.overflow = '';
  };
})();

(function () {
  const inhTotalScreens = 6;
  let inhIdx = 0;
  let inhLoopTimer = null;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function chipsHTML(refs) {
    return refs.map(function (r) { return '<span class="salat-chip">' + esc(r) + '</span>'; }).join('');
  }

  /* segments: [{label, pct}]  opts.allowOverflow lets the bar burst past 100% in crimson */
  function barHTML(barId, segments, opts) {
    opts = opts || {};
    let html = '<div class="inh-bar-outer" id="' + barId + '"></div>';
    html += '<div class="inh-seg-labels">' + segments.map(function (s) {
      return '<span>' + esc(s.label) + ' ' + s.pct.toFixed(1) + '%</span>';
    }).join('') + '</div>';
    return html;
  }

  function paintBar(barId, segments, opts) {
    opts = opts || {};
    const container = document.getElementById(barId);
    if (!container) return;
    let html = '';
    let cum = 0;
    segments.forEach(function (seg) {
      const start = cum;
      const end = cum + seg.pct;
      if (opts.allowOverflow && start < 100 && end > 100) {
        const goldWidth = 100 - start;
        const crimsonWidth = end - 100;
        html += '<div class="inh-bar-seg" data-w="' + goldWidth + '" style="left:' + start + '%;background:var(--gold);"></div>';
        html += '<div class="inh-bar-seg" data-w="' + crimsonWidth + '" style="left:100%;background:#8a2f2f;"></div>';
      } else {
        html += '<div class="inh-bar-seg" data-w="' + seg.pct + '" style="left:' + start + '%;background:var(--gold);"></div>';
      }
      cum = end;
    });
    container.innerHTML = html;
    const segEls = container.querySelectorAll('.inh-bar-seg');
    segEls.forEach(function (el, i) {
      el.style.width = el.getAttribute('data-w') + '%';
      el.style.transform = 'scaleX(0)';
      setTimeout(function () { el.style.transform = 'scaleX(1)'; }, 120 + i * 160);
    });
  }

  const screen1Segments = [
    { label: 'Wife', pct: 12.5 },
    { label: 'Daughters', pct: 66.7 },
    { label: 'Mother', pct: 16.7 },
    { label: 'Father', pct: 16.7 }
  ];
  const screen3Segments = [
    { label: 'Debts', pct: 5.0 },
    { label: 'Will', pct: 10.0 },
    { label: 'Daughters', pct: 56.7 },
    { label: 'Mother', pct: 4.7 },
    { label: 'Father', pct: 4.7 },
    { label: 'Wife', pct: 2.4 },
    { label: 'Kin and poor', pct: 16.5 }
  ];
  const screen4Segments = [40, 24, 14.4, 8.6, 5.2];

  const inheritDefend = [
    { q: "You just changed the order to escape.",
      a: "I did not pick the order. The Book did. Every share in 4:11 and 4:12 says after the will and the debts. That is Allah giving the order. Adding everything at once is the method men picked, and it is the one that needed a fix. Reading the Book in the Book's own order is not escaping. It is just reading." },
    { q: "1400 years of scholars read it as one pie. You know better?",
      a: "Those same scholars admit their way breaks. That is what awl is. A repair. And the repair cuts down shares Allah fixed. So ask the simple question. Who changed Allah's numbers? Not me. I keep Allah's numbers and question their method. They kept their method and edited Allah's numbers. Say that out loud and see which side sounds right." },
    { q: "So where does the leftover money go?",
      a: "The Book says where. The will for parents and relatives, 2:180. The relatives, orphans, and poor standing at the split, 4:8. Money left over goes to family and the needy. That is a good thing. Going over 100 is the only real problem, and in the Book's order it cannot happen." },
    { q: "But a wife, two daughters, and both parents CAN all be in one family.",
      a: "They can. And in the Book's order, every one of them gets paid, and the total still cannot pass 100. A real family only breaks the critics' method. That is the whole point. The family is real. The overflow is made up." },
    { q: "The will is optional, so you cannot count on it.",
      a: "2:180 uses the words kutiba alaykum. Made a duty for you. The same command form as fasting in 2:183. The will is an order, not a suggestion. And even if someone dies with no will, the shares still go in order, each from what is left, and still cannot pass 100. The will makes the system stronger. The system does not fall without it." }
  ];

  function buildScreen1() {
    return '<div class="salat-screen" data-idx="0">' +
      '<div class="salat-heading">THE 112.5% TRICK</div>' +
      '<div class="salat-body-text">There is an easy version of this attack. It adds shares that can never be in the same family at the same time. The written entry above already kills that one. But there is a harder version. One family where every person is real. A man dies. He leaves a wife, two daughters, his mother, and his father. Wife: one eighth. Two daughters: two thirds. Mother: one sixth. Father: one sixth. Add them all at the same time, the way the critics do, and you get 112.5 percent. More than the whole thing. That is the screenshot they wave around. Now watch what they skipped.</div>' +
      '<div class="inh-heir-chips">' +
        '<span class="inh-heir-chip">Wife 1/8</span>' +
        '<span class="inh-heir-chip">Daughters 2/3</span>' +
        '<span class="inh-heir-chip">Mother 1/6</span>' +
        '<span class="inh-heir-chip">Father 1/6</span>' +
      '</div>' +
      barHTML('inhBar1', screen1Segments, { allowOverflow: true }) +
      '<div class="inh-total-label">112.5%</div>' +
      '<div class="salat-chips">' + chipsHTML(['4:11', '4:12']) + '</div>' +
      '</div>';
  }

  function buildScreen2() {
    return '<div class="salat-screen" data-idx="1">' +
      '<div class="salat-heading">THE ORDER THEY SKIPPED</div>' +
      '<div class="salat-body-text">Now read the Book. Every share has the same words attached: after any will he leaves, and after debts. It is right there in 4:11 and 4:12. That is an order. First, pay the debts. Second, the will. And the will is not a maybe. 2:180 says it is a duty, the same command word the Quran uses for fasting. Third, the shares split what is left. The critics skipped steps one and two, then blamed the Book for their answer.</div>' +
      '<div class="salat-arabic" dir="rtl">مِن بَعْدِ وَصِيَّةٍ يُوصِي بِهَا أَوْ دَيْنٍ</div>' +
      '<div class="salat-chips">' + chipsHTML(['4:11', '4:12', '2:180']) + '</div>' +
      '</div>';
  }

  function buildScreen3() {
    return '<div class="salat-screen" data-idx="2">' +
      '<div class="salat-heading">SAME FAMILY, THE BOOK\'S WAY</div>' +
      '<div class="salat-body-text">Same family. Same shares. But now in the Book\'s order. Debts come out first. The will comes next. Then the shares, one by one, each from what is left. Two thirds to the daughters. A sixth each to the mother and father, from what is left. An eighth to the wife, from what is left after that. Look at the bar. It never goes over. And the money still left has a home too: the relatives, the orphans, and the poor standing there at the split.</div>' +
      barHTML('inhBar3', screen3Segments) +
      '<div class="inh-note">example sizes, the point is the order</div>' +
      '<div class="inh-badge-gold">NEVER GOES OVER</div>' +
      '<div class="salat-chips">' + chipsHTML(['4:11', '4:12', '4:8']) + '</div>' +
      '</div>';
  }

  function buildScreen4() {
    let barHtml = '<div class="inh-bar-outer" id="inhBar4"></div>';
    return '<div class="salat-screen" data-idx="3">' +
      '<div class="salat-heading">WHY IT CAN NEVER BREAK</div>' +
      '<div class="salat-body-text">Here is the part they cannot answer. Take a piece of what is left. Then a piece of what is left after that. Keep going forever. You can never pass the whole. It is impossible. The 112.5 percent is not in the Quran. It only lives in their method.</div>' +
      barHtml +
      '<div class="inh-note">looping demonstration — leftover never reaches the edge</div>' +
      '<div class="salat-chips">' + chipsHTML(['4:11', '4:12']) + '</div>' +
      '</div>';
  }

  function buildScreen5() {
    return '<div class="salat-screen" data-idx="4">' +
      '<div class="salat-heading">WHOSE MATH ACTUALLY BROKE</div>' +
      '<div class="salat-body-text">One last receipt, from their own shelf. Adding everything at once is the scholars\' method. And their own books admit it breaks. That is why they made a fix called awl, at Caliph Umar\'s table, years after the revelation. The fix cuts down the shares Allah gave until the total fits again. The Quran never says awl. Think about that. Their own books say the overflow came from a method men picked, not from Allah\'s Book. Their calculator is broken. The Book is clean.</div>' +
      '<div class="salat-chips">' + chipsHTML(['4:13']) + '</div>' +
      '</div>';
  }

  function inhDefendCardHTML(card, i) {
    return '<div class="defend-card" id="inhDefendCard' + i + '">' +
      '<div class="defend-q" onclick="toggleInheritDefendCard(' + i + ')"><span>' + esc(card.q) + '</span><span class="defend-caret">▶</span></div>' +
      '<div class="defend-a" id="inhDefendA' + i + '"><div class="defend-a-inner">' + esc(card.a) + '</div></div>' +
      '</div>';
  }

  function buildScreen6() {
    let inner;
    if (typeof isMember === 'function' && isMember()) {
      inner = '<div class="salat-defend-list">' + inheritDefend.map(inhDefendCardHTML).join('') + '</div>';
    } else {
      const lockedRows = inheritDefend.map(function (card) {
        return '<div class="defend-locked-row">🔒 <span>' + esc(card.q) + '</span></div>';
      }).join('');
      inner = '<div class="salat-defend-list">' + lockedRows + '</div>' +
        '<div class="salat-body-text" style="text-align:center;">Members get the answer script for every objection.</div>' +
        '<button class="salat-nav-btn primary" style="max-width:320px;flex:none;padding:0 1.2rem;" onclick="openModal()">⭐ Unlock Defend This · $2.99/mo</button>';
    }
    return '<div class="salat-screen" data-idx="5">' +
      '<div class="salat-heading">DEFEND THIS</div>' +
      '<div class="salat-sub">The five comebacks you will hear, and the answer for each.</div>' +
      inner +
      '</div>';
  }

  function renderInhScreens() {
    let html = buildScreen1() + buildScreen2() + buildScreen3() + buildScreen4() + buildScreen5() + buildScreen6();
    document.getElementById('inhScreens').innerHTML = html;

    let dots = '';
    for (let i = 0; i < inhTotalScreens; i++) dots += '<span class="salat-dot" data-dot="' + i + '"></span>';
    document.getElementById('inhDots').innerHTML = dots;
  }

  function runScreen4Loop() {
    stopScreen4Loop();
    function tick() {
      const container = document.getElementById('inhBar4');
      if (!container) return;
      let html = '';
      let cum = 0;
      screen4Segments.forEach(function (pct) {
        html += '<div class="inh-bar-seg" data-w="' + pct + '" style="left:' + cum + '%;background:var(--gold);"></div>';
        cum += pct;
      });
      container.innerHTML = html;
      container.querySelectorAll('.inh-bar-seg').forEach(function (el, i) {
        el.style.width = el.getAttribute('data-w') + '%';
        el.style.transform = 'scaleX(0)';
        setTimeout(function () { el.style.transform = 'scaleX(1)'; }, 100 + i * 140);
      });
    }
    tick();
    inhLoopTimer = setInterval(tick, 3000);
  }

  function stopScreen4Loop() {
    if (inhLoopTimer) { clearInterval(inhLoopTimer); inhLoopTimer = null; }
  }

  function showInhScreen(idx) {
    idx = Math.max(0, Math.min(inhTotalScreens - 1, idx));
    document.querySelectorAll('#inhScreens .salat-screen').forEach(function (el) {
      el.classList.toggle('active', parseInt(el.dataset.idx, 10) === idx);
    });
    inhIdx = idx;
    document.querySelectorAll('#inhDots .salat-dot').forEach(function (el) {
      el.classList.toggle('active', parseInt(el.dataset.dot, 10) === idx);
    });
    document.getElementById('inhBackBtn').disabled = idx === 0;
    document.getElementById('inhNextBtn').style.display = idx === inhTotalScreens - 1 ? 'none' : '';
    document.getElementById('inhScreens').scrollTop = 0;

    if (idx === 0) paintBar('inhBar1', screen1Segments, { allowOverflow: true });
    if (idx === 2) paintBar('inhBar3', screen3Segments);
    if (idx === 3) { runScreen4Loop(); } else { stopScreen4Loop(); }
  }

  window.inhNav = function (dir) { showInhScreen(inhIdx + dir); };

  window.toggleInheritDefendCard = function (i) {
    document.getElementById('inhDefendCard' + i).classList.toggle('open');
  };

  window.openInheritanceOverlay = function () {
    renderInhScreens();
    showInhScreen(0);
    document.getElementById('inheritOverlay').classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  window.closeInheritanceOverlay = function () {
    stopScreen4Loop();
    document.getElementById('inheritOverlay').classList.remove('visible');
    document.body.style.overflow = '';
  };
})();

(function () {
  const DG_MUTE_KEY = 'alhaqq_dg_mute';

  const DG_SCENARIO = {
    word: "ضَرَبَ", translit: "DARABA",
    hook: "Your own book tells men to beat their wives. 4:34. Explain that.",
    sub: "One Arabic word decides it. Three tries.",
    choices: [
      { label: "TO BEAT", kind: "violation",
        cap: "HE RAISES HIS HAND...", cap2: "THE BOOK INTERRUPTS", stamp: "VIOLATION",
        ar: "وَلَا تُمْسِكُوهُنَّ ضِرَارًا لِّتَعْتَدُوا",
        en: "Do not hold on to them in order to harm them.",
        ref: "SURAH AL-BAQARAH 2:231", ref2: "AR-RUM 30:21",
        explain: "You picked the critics' meaning. The Book itself throws the flag. It cannot command harm here and forbid harm there. Something is wrong with that translation." },
      { label: "TO SEPARATE", kind: "win",
        cap: "THEY PART. NO HARM. NO CONTRADICTION.", stamp: "PASSES THE BOOK",
        ar: "أَفَنَضْرِبُ عَنكُمُ الذِّكْرَ صَفْحًا",
        en: "Shall We then turn the Reminder away from you?",
        ref: "SURAH AZ-ZUKHRUF 43:5",
        explain: "Same root, and Allah uses it for turning away, not striking. And look at 4:34 itself: advise, then distance in the beds, then separate. Three steps of growing space. The Book stays consistent from the first word to the last." },
      { label: "TO TRAVEL", kind: "misfit",
        cap: "...AND HE LEFT THE COUNTRY", stamp: "DOES NOT FIT",
        ar: "وَإِذَا ضَرَبْتُمْ فِي الْأَرْضِ",
        en: "And when you travel through the land...",
        ref: "SURAH AN-NISA 4:94",
        explain: "Daraba really does mean travel in 4:94. But this verse is not sending anyone on a trip. Real meaning, wrong door." }
    ],
    reply: "Daraba has more than five meanings inside the Quran itself. Strike a rock in 2:60. Strike an example in 14:24. Travel in 4:94. Turn away in 43:5. And 2:231 already commands men never to hold wives to harm them. Allah does not command harm in one verse and forbid it in another. Pick the meaning that matches the Book, not the one that matches your accusation.",
    verdictTitle: "HONEST TRANSLATOR"
  };

  function dgEsc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  /* ── audio ── */
  let dgCtx = null;
  function dgGetCtx() {
    if (!dgCtx) { try { dgCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { dgCtx = null; } }
    if (dgCtx && dgCtx.state === 'suspended') { dgCtx.resume().catch(() => {}); }
    return dgCtx;
  }
  function dgMuted() { return localStorage.getItem(DG_MUTE_KEY) === '1'; }
  function dgTone(freq, durMs, type, vol, delayMs) {
    if (dgMuted()) return;
    const ctx = dgGetCtx(); if (!ctx) return;
    const t0 = ctx.currentTime + (delayMs || 0) / 1000;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = type || 'sine'; osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + durMs / 1000 + 0.02);
  }
  function dgSThump() { dgTone(90, 160, 'sine', 0.5, 0); }
  function dgSWin() { dgTone(523, 140, 'triangle', 0.3, 0); dgTone(659, 140, 'triangle', 0.3, 100); dgTone(784, 220, 'triangle', 0.3, 200); }
  function dgSWomp() { dgTone(180, 220, 'sine', 0.25, 0); dgTone(90, 260, 'sine', 0.25, 120); }
  function dgSFanfare() { dgTone(523, 160, 'triangle', 0.28, 0); dgTone(659, 160, 'triangle', 0.28, 130); dgTone(784, 160, 'triangle', 0.28, 260); dgTone(1046, 320, 'triangle', 0.3, 390); }

  function dgReducedMotion() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function dgVibrate(pattern) { try { if (navigator.vibrate && !dgReducedMotion()) navigator.vibrate(pattern); } catch (e) {} }

  const DG_GLYPHS = { violation: ['✕'], win: ['◈', '✦', '۞'] };
  const DG_GLYPH_COLORS = { violation: ['#a83232'], win: ['var(--gold)', '#8a7434'] };
  function dgSpawnGlyphs(container, kind, count) {
    if (dgReducedMotion() || !container) return;
    const glyphs = DG_GLYPHS[kind]; const colors = DG_GLYPH_COLORS[kind];
    if (!glyphs) return;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'dg-particle-glyph';
      s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      s.style.color = colors[Math.floor(Math.random() * colors.length)];
      s.style.fontSize = (10 + Math.random() * 8) + 'px';
      s.style.left = (10 + Math.random() * 80) + '%';
      s.style.top = (18 + Math.random() * 55) + '%';
      s.style.animationDelay = (Math.random() * 0.9) + 's';
      s.style.animationDuration = (2.2 + Math.random() * 0.8) + 's';
      container.appendChild(s);
      setTimeout(() => s.remove(), 3200);
    }
  }

  /* ── scene: couple ── */
  function dgSceneHTML() {
    return '<div class="dg-scene-wrap" id="dgSceneWrap">' +
      '<svg viewBox="0 0 360 220">' +
        '<rect class="dg-flash" x="0" y="0" width="360" height="220"/>' +
        '<line class="dg-scene-divider" x1="180" y1="20" x2="180" y2="200" stroke="var(--gold)" stroke-width="1.5"/>' +
        '<g class="dg-scene-figure dg-fig-l">' +
          '<circle cx="120" cy="80" r="16" fill="none" stroke="var(--gold)" stroke-width="2"/>' +
          '<path d="M100 100 Q120 96 140 100 L136 170 Q120 178 104 170 Z" fill="none" stroke="var(--gold)" stroke-width="2"/>' +
        '</g>' +
        '<g class="dg-scene-figure dg-fig-r">' +
          '<circle cx="240" cy="80" r="16" fill="none" stroke="var(--gold)" stroke-width="2"/>' +
          '<path d="M220 100 Q240 96 260 100 L256 170 Q240 178 224 170 Z" fill="none" stroke="var(--gold)" stroke-width="2"/>' +
          '<line class="dg-arm-r" x1="235" y1="120" x2="200" y2="120" stroke="var(--gold)" stroke-width="2"/>' +
        '</g>' +
      '</svg>' +
    '</div>';
  }
  function dgSceneRun(kind) {
    const wrap = document.getElementById('dgSceneWrap');
    if (!wrap) return;
    wrap.classList.remove('violation', 'misfit', 'win');
    void wrap.offsetWidth;
    wrap.classList.add(kind);
    if (kind === 'violation') dgSpawnGlyphs(wrap, 'violation', 6);
    if (kind === 'win') dgSpawnGlyphs(wrap, 'win', 8);
  }
  function dgSceneReset() {
    const wrap = document.getElementById('dgSceneWrap');
    if (wrap) wrap.classList.remove('violation', 'misfit', 'win');
  }

  /* ── toast ── */
  let dgToastTimer = null;
  function dgToast(msg) {
    let el = document.getElementById('dgToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dgToast';
      el.className = 'dg-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('visible');
    clearTimeout(dgToastTimer);
    dgToastTimer = setTimeout(() => el.classList.remove('visible'), 2200);
  }

  /* ── stage screen ── */
  let dgSession = null;

  function dgBuildStageHTML(scenario) {
    return '<div class="dg-tries" id="dgTries">' +
        [0, 1, 2].map(i => '<span class="dg-try-dot" data-i="' + i + '">◈</span>').join('') +
        '<span class="dg-tries-label" id="dgTriesLabel">THREE TRIES</span>' +
      '</div>' +
      '<div class="dg-word-ar">' + scenario.word + '</div>' +
      '<div class="dg-word-translit">' + dgEsc(scenario.translit) + '</div>' +
      '<div class="dg-hook">' + dgEsc(scenario.hook) + '</div>' +
      '<div class="dg-sub">' + dgEsc(scenario.sub) + '</div>' +
      dgSceneHTML() +
      '<div class="dg-choices" id="dgChoices">' +
        scenario.choices.map((c, i) => '<button class="dg-choice-btn" id="dgChoiceBtn' + i + '" onclick="dgChoose(' + i + ')">' + dgEsc(c.label) + '</button>').join('') +
      '</div>' +
      '<div id="dgResolvePanel"></div>' +
      '<div class="dg-footer-line">Three doors. The Book only opens one.</div>';
  }

  function dgResolvePanelHTML(choice) {
    return '<div class="dg-stamp-wrap"><div class="dg-stamp ' + choice.kind + '">' + dgEsc(choice.stamp) + '</div></div>' +
      '<div class="dg-cap">' + dgEsc(choice.cap) + '</div>' +
      (choice.cap2 ? '<div class="dg-cap2">' + dgEsc(choice.cap2) + '</div>' : '') +
      '<div class="dg-verse-card">' +
        '<div class="dg-verse-ar">' + choice.ar + '</div>' +
        '<div class="dg-verse-en">' + dgEsc(choice.en) + '</div>' +
        '<div class="dg-verse-ref">' + dgEsc(choice.ref) + (choice.ref2 ? ' &middot; ' + dgEsc(choice.ref2) : '') + '</div>' +
      '</div>' +
      '<div class="dg-explain">' + dgEsc(choice.explain) + '</div>' +
      '<div id="dgResolveNav"></div>';
  }

  function dgRenderStage(scenario) {
    document.getElementById('dgStage').innerHTML = dgBuildStageHTML(scenario);
  }

  window.dgChoose = function (idx) {
    if (!dgSession || dgSession.locked) return;
    if (!dgMuted()) dgGetCtx();
    const scenario = dgSession.scenario;
    const choice = scenario.choices[idx];
    dgSession.locked = true;
    scenario.choices.forEach((c, i) => { document.getElementById('dgChoiceBtn' + i).disabled = true; });

    dgSceneRun(choice.kind);

    setTimeout(function () {
      if (choice.kind === 'violation') { dgSThump(); dgVibrate([40, 30, 40]); }
      else if (choice.kind === 'misfit') { dgSWomp(); dgVibrate(30); }
      else { dgSWin(); dgVibrate([20, 20, 20, 20, 60]); }

      const btn = document.getElementById('dgChoiceBtn' + idx);
      btn.classList.add(choice.kind === 'win' ? 'stamped-win' : 'stamped-wrong');

      const panel = document.getElementById('dgResolvePanel');
      panel.innerHTML = dgResolvePanelHTML(choice);

      dgSession.doorHistory.push(choice.kind);

      const triesUsed = dgSession.doorHistory.length;
      const label = document.getElementById('dgTriesLabel');
      if (choice.kind === 'win') {
        const dot = document.querySelector('#dgTries [data-i="' + idx + '"]');
        if (dot) { dot.textContent = '◈'; dot.className = 'dg-try-dot used-win'; }
        document.querySelectorAll('#dgTries .dg-try-dot').forEach(d => {
          if (d.className === 'dg-try-dot') d.className = 'dg-try-dot moot';
        });
        if (label) label.textContent = 'SOLVED IN ' + triesUsed;
      } else {
        if (label) label.textContent = (3 - triesUsed) + (3 - triesUsed === 1 ? ' TRY LEFT' : ' REMAIN');
      }

      const nav = document.getElementById('dgResolveNav');
      if (choice.kind === 'win') {
        nav.innerHTML = '<button class="dg-nav-btn primary" onclick="dgFinish()">See Verdict</button>';
      } else {
        nav.innerHTML = '<button class="dg-nav-btn primary" onclick="dgRetry(' + idx + ')">Try Again</button>';
      }
    }, 550);
  };

  window.dgRetry = function (idx) {
    const scenario = dgSession.scenario;
    dgSceneReset();
    document.getElementById('dgResolvePanel').innerHTML = '';
    scenario.choices.forEach((c, i) => {
      if (i === idx) return;
      document.getElementById('dgChoiceBtn' + i).disabled = false;
    });
    dgSession.locked = false;
    const tries = document.getElementById('dgTries');
    if (tries) {
      const dot = tries.querySelector('[data-i="' + idx + '"]');
      if (dot) { dot.textContent = '✕'; dot.className = 'dg-try-dot used-wrong'; }
    }
  };

  window.dgFinish = function () {
    const scenario = dgSession.scenario;
    dgSFanfare();
    dgRenderVerdict(scenario, dgSession.doorHistory);
    dgShowScreen('dgVerdict');
  };

  /* ── verdict screen ── */
  function dgRenderVerdict(scenario, doorHistory) {
    const el = document.getElementById('dgVerdict');
    const chips = doorHistory.map(k => '<span class="dg-chip ' + (k === 'win' ? 'win' : 'wrong') + '">' + (k === 'win' ? '✓' : '✗') + '</span>').join('');
    const shareText = scenario.word + ' (' + scenario.translit + ')\n' + doorHistory.map(k => k === 'win' ? '🟡' : '🔴').join('') + '\n' + scenario.reply;
    el.innerHTML =
      '<div class="dg-verdict-title">' + dgEsc(scenario.verdictTitle) + '</div>' +
      '<div class="dg-chip-row">' + chips + '</div>' +
      '<div class="dg-reply-panel">' +
        '<div class="dg-reply-label">Loaded Reply</div>' +
        '<div class="dg-reply-text" id="dgReplyText">' + dgEsc(scenario.reply) + '</div>' +
        '<div class="dg-reply-actions">' +
          '<button class="dg-nav-btn" onclick="dgCopyReply()">Copy Reply</button>' +
          '<button class="dg-nav-btn" onclick="dgShareVerdict()">Share Verdict</button>' +
        '</div>' +
      '</div>' +
      '<button class="dg-nav-btn primary" onclick="closeDarabaGame()">Close</button>' +
      '<div class="dg-footer-line">One word, defended.</div>';
    el.dataset.shareText = shareText;
  }

  window.dgCopyReply = function () {
    const t = document.getElementById('dgReplyText').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(t).then(() => dgToast('Reply copied.')).catch(() => dgToast('Reply copied.'));
    } else { dgToast('Reply copied.'); }
  };

  window.dgShareVerdict = function () {
    const el = document.getElementById('dgVerdict');
    const text = el.dataset.shareText || '';
    if (navigator.share) {
      navigator.share({ text: text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => dgToast('Verdict copied to share.')).catch(() => {});
    } else { dgToast('Verdict copied to share.'); }
  };

  /* ── overlay open/close ── */
  function dgShowScreen(id) {
    document.querySelectorAll('#darabaGameOverlay .dg-screen').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  window.openDarabaGame = function () {
    dgSession = { scenario: DG_SCENARIO, doorHistory: [], locked: false };
    dgRenderStage(DG_SCENARIO);
    dgShowScreen('dgStage');
    document.getElementById('dgMuteBtn').textContent = dgMuted() ? '🔇' : '🔊';
    document.getElementById('darabaGameOverlay').classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  window.closeDarabaGame = function () {
    document.getElementById('darabaGameOverlay').classList.remove('visible');
    document.body.style.overflow = '';
  };

  window.dgToggleMute = function () {
    const muted = dgMuted();
    localStorage.setItem(DG_MUTE_KEY, muted ? '0' : '1');
    document.getElementById('dgMuteBtn').textContent = muted ? '🔊' : '🔇';
  };
})();

import type { Question, LocalizedOptions } from '../types';

export const QUESTION_BANK: Question[] = [
  // --- LEVEL 1 (€100) ---
  {
    id: 'l1_q1',
    level: 1,
    category: 'Geography',
    question: {
      it: 'Qual è la capitale dell\'Italia?',
      en: 'What is the capital of Italy?',
      es: '¿Cuál es la capital de Italia?',
      fr: 'Quelle est la capitale de l\'Italie ?',
      de: 'Was ist die Hauptstadt von Italien?'
    },
    options: {
      it: ['Roma', 'Milano', 'Napoli', 'Torino'],
      en: ['Rome', 'Milan', 'Naples', 'Turin'],
      es: ['Roma', 'Milán', 'Nápoles', 'Turín'],
      fr: ['Rome', 'Milan', 'Naples', 'Turin'],
      de: ['Rom', 'Mailand', 'Neapel', 'Turin']
    },
    correctAnswer: 0,
    explanation: {
      it: 'Roma è la capitale della Repubblica Italiana dal 1871.',
      en: 'Rome has been the capital of Italy since 1871.',
      es: 'Roma es la capital de Italia desde 1871.',
      fr: 'Rome est la capitale de l\'Italie depuis 1871.',
      de: 'Rom ist seit 1871 die Hauptstadt Italiens.'
    }
  },
  {
    id: 'l1_q2',
    level: 1,
    category: 'Biology',
    question: {
      it: 'Quante zampe ha un ragno adulto?',
      en: 'How many legs does an adult spider have?',
      es: '¿Cuántas patas tiene una araña adulta?',
      fr: 'Combien de pattes possède une araignée adulte ?',
      de: 'Wie viele Beine hat eine ausgewachsene Spinne?'
    },
    options: {
      it: ['8 zampe', '6 zampe', '10 zampe', '4 zampe'],
      en: ['8 legs', '6 legs', '10 legs', '4 legs'],
      es: ['8 patas', '6 patas', '10 patas', '4 patas'],
      fr: ['8 pattes', '6 pattes', '10 pattes', '4 pattes'],
      de: ['8 Beine', '6 Beine', '10 Beine', '4 Beine']
    },
    correctAnswer: 0
  },
  {
    id: 'l1_q3',
    level: 1,
    category: 'General',
    question: {
      it: 'Qual è il colore del cielo in una giornata serena?',
      en: 'What color is the sky on a clear day?',
      es: '¿De qué color es el cielo en un día despejado?',
      fr: 'De quelle couleur est le ciel par un jour dégagé ?',
      de: 'Welche Farbe hat der Himmel an einem klaren Tag?'
    },
    options: {
      it: ['Blu', 'Verde', 'Rosso', 'Giallo'],
      en: ['Blue', 'Green', 'Red', 'Yellow'],
      es: ['Azul', 'Verde', 'Rojo', 'Amarillo'],
      fr: ['Bleu', 'Vert', 'Rouge', 'Jaune'],
      de: ['Blau', 'Grün', 'Rot', 'Gelb']
    },
    correctAnswer: 0
  },

  // --- LEVEL 2 (€200) ---
  {
    id: 'l2_q1',
    level: 2,
    category: 'Chemistry',
    question: {
      it: 'Quale elemento chimico ha il simbolo "O"?',
      en: 'Which chemical element has the symbol "O"?',
      es: '¿Qué elemento químico tiene el símbolo "O"?',
      fr: 'Quel élément chimique a pour symbole « O » ?',
      de: 'Welches chemische Element hat das Symbol "O"?'
    },
    options: {
      it: ['Ossigeno', 'Oro', 'Osmio', 'Idrogeno'],
      en: ['Oxygen', 'Gold', 'Osmium', 'Hydrogen'],
      es: ['Oxígeno', 'Oro', 'Osmio', 'Hidrógeno'],
      fr: ['Oxygène', 'Or', 'Osmium', 'Hydrogène'],
      de: ['Sauerstoff', 'Gold', 'Osmium', 'Wasserstoff']
    },
    correctAnswer: 0
  },
  {
    id: 'l2_q2',
    level: 2,
    category: 'Geography',
    question: {
      it: 'Qual è l\'oceano più grande della Terra?',
      en: 'What is the largest ocean on Earth?',
      es: '¿Cuál es el océano más grande de la Tierra?',
      fr: 'Quel est le plus grand océan de la Terre ?',
      de: 'Was ist der größte Ozean der Erde?'
    },
    options: {
      it: ['Oceano Pacifico', 'Oceano Atlantico', 'Oceano Indiano', 'Oceano Artico'],
      en: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
      es: ['Océano Pacífico', 'Océano Atlántico', 'Océano Índico', 'Océano Ártico'],
      fr: ['Océan Pacifique', 'Océan Atlantique', 'Océan Indien', 'Océan Arctique'],
      de: ['Pazifischer Ozean', 'Atlantischer Ozean', 'Indischer Ozean', 'Arktischer Ozean']
    },
    correctAnswer: 0
  },

  // --- LEVEL 3 (€300) ---
  {
    id: 'l3_q1',
    level: 3,
    category: 'Art',
    question: {
      it: 'Chi ha dipinto la famosa opera "La Gioconda"?',
      en: 'Who painted the famous artwork "Mona Lisa"?',
      es: '¿Quién pintó la famosa obra "La Gioconda"?',
      fr: 'Qui a peint la célèbre œuvre « La Joconde » ?',
      de: 'Wer hat das berühmte Kunstwerk "Mona Lisa" gemalt?'
    },
    options: {
      it: ['Leonardo da Vinci', 'Michelangelo', 'Raffaello', 'Caravaggio'],
      en: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Caravaggio'],
      es: ['Leonardo da Vinci', 'Miguel Ángel', 'Rafael', 'Caravaggio'],
      fr: ['Léonard de Vinci', 'Michel-Ange', 'Raphaël', 'Caravage'],
      de: ['Leonardo da Vinci', 'Michelangelo', 'Raffael', 'Caravaggio']
    },
    correctAnswer: 0
  },
  {
    id: 'l3_q2',
    level: 3,
    category: 'Cinema',
    question: {
      it: 'Qual è il nome del maghetto protagonista creato da J.K. Rowling?',
      en: 'What is the name of the boy wizard created by J.K. Rowling?',
      es: '¿Cuál es el nombre del mago protagonista creado por J.K. Rowling?',
      fr: 'Quel est le nom du sorcier créé par J.K. Rowling ?',
      de: 'Wie heißt der Zauberschüler von J.K. Rowling?'
    },
    options: {
      it: ['Harry Potter', 'Percy Jackson', 'Frodo Baggins', 'Luke Skywalker'],
      en: ['Harry Potter', 'Percy Jackson', 'Frodo Baggins', 'Luke Skywalker'],
      es: ['Harry Potter', 'Percy Jackson', 'Frodo Bolsón', 'Luke Skywalker'],
      fr: ['Harry Potter', 'Percy Jackson', 'Frodo Sacquet', 'Luke Skywalker'],
      de: ['Harry Potter', 'Percy Jackson', 'Frodo Beutlin', 'Luke Skywalker']
    },
    correctAnswer: 0
  },

  // --- LEVEL 4 (€500) ---
  {
    id: 'l4_q1',
    level: 4,
    category: 'Astronomy',
    question: {
      it: 'Qual è il pianeta più grande del sistema solare?',
      en: 'What is the largest planet in our solar system?',
      es: '¿Cuál es el planeta más grande del sistema solar?',
      fr: 'Quelle est la plus grande planète du système solaire ?',
      de: 'Was ist der größte Planet in unserem Sonnensystem?'
    },
    options: {
      it: ['Giove', 'Saturno', 'Marte', 'Nettuno'],
      en: ['Jupiter', 'Saturn', 'Mars', 'Neptune'],
      es: ['Júpiter', 'Saturno', 'Marte', 'Neptuno'],
      fr: ['Jupiter', 'Saturne', 'Mars', 'Neptune'],
      de: ['Jupiter', 'Saturn', 'Mars', 'Neptun']
    },
    correctAnswer: 0
  },
  {
    id: 'l4_q2',
    level: 4,
    category: 'Sports',
    question: {
      it: 'Quanti giocatori compongono una squadra di calcio in campo?',
      en: 'How many players are on a football (soccer) team on the pitch?',
      es: '¿Cuántos jugadores hay en un equipo de fútbol en el campo?',
      fr: 'Combien de joueurs composent une équipe de football sur le terrain ?',
      de: 'Wie viele Spieler stehen bei einer Fußballmannschaft auf dem Platz?'
    },
    options: {
      it: ['11 giocatori', '10 giocatori', '12 giocatori', '9 giocatori'],
      en: ['11 players', '10 players', '12 players', '9 players'],
      es: ['11 jugadores', '10 jugadores', '12 jugadores', '9 jugadores'],
      fr: ['11 joueurs', '10 joueurs', '12 joueurs', '9 joueurs'],
      de: ['11 Spieler', '10 Spieler', '12 Spieler', '9 Spieler']
    },
    correctAnswer: 0
  },

  // --- LEVEL 5 (€1,000 - SAFETY CHECKPOINT) ---
  {
    id: 'l5_q1',
    level: 5,
    category: 'Literature',
    question: {
      it: 'Chi è l\'autore della "Divina Commedia"?',
      en: 'Who is the author of the "Divine Comedy"?',
      es: '¿Quién es el autor de la "Divina Comedia"?',
      fr: 'Qui est l\'auteur de la « Divine Comédie » ?',
      de: 'Wer ist der Autor der "Göttlichen Komödie"?'
    },
    options: {
      it: ['Dante Alighieri', 'Giovanni Boccaccio', 'Francesco Petrarca', 'Giacomo Leopardi'],
      en: ['Dante Alighieri', 'Giovanni Boccaccio', 'Francesco Petrarch', 'Giacomo Leopardi'],
      es: ['Dante Alighieri', 'Giovanni Boccaccio', 'Francesco Petrarca', 'Giacomo Leopardi'],
      fr: ['Dante Alighieri', 'Jean Boccace', 'Pétrarque', 'Giacomo Leopardi'],
      de: ['Dante Alighieri', 'Giovanni Boccaccio', 'Francesco Petrarca', 'Giacomo Leopardi']
    },
    correctAnswer: 0,
    explanation: {
      it: 'Dante Alighieri scrisse la Divina Commedia tra il 1304 e il 1321.',
      en: 'Dante Alighieri wrote the Divine Comedy between 1304 and 1321.',
      es: 'Dante Alighieri escribió la Divina Comedia entre 1304 y 1321.',
      fr: 'Dante Alighieri a écrit la Divine Comédie entre 1304 et 1321.',
      de: 'Dante Alighieri schrieb die Göttliche Komödie zwischen 1304 und 1321.'
    }
  },
  {
    id: 'l5_q2',
    level: 5,
    category: 'Geography',
    question: {
      it: 'In quale nazione si trovano le piramidi di Giza?',
      en: 'In which country are the Pyramids of Giza located?',
      es: '¿En qué país se encuentran las pirámides de Guiza?',
      fr: 'Dans quel pays se trouvent les pyramides de Gizeh ?',
      de: 'In welchem Land befinden sich die Pyramiden von Gizeh?'
    },
    options: {
      it: ['Egitto', 'Grecia', 'Messico', 'Perù'],
      en: ['Egypt', 'Greece', 'Mexico', 'Peru'],
      es: ['Egipto', 'Grecia', 'México', 'Perú'],
      fr: ['Égypte', 'Grèce', 'Mexique', 'Pérou'],
      de: ['Ägypten', 'Griechenland', 'Mexiko', 'Peru']
    },
    correctAnswer: 0
  },

  // --- LEVEL 6 (€2,000) ---
  {
    id: 'l6_q1',
    level: 6,
    category: 'History',
    question: {
      it: 'In quale anno è caduto il Muro di Berlino?',
      en: 'In which year did the Berlin Wall fall?',
      es: '¿En qué año cayó el Muro de Berlín?',
      fr: 'En quelle année le mur de Berlin est-il tombé ?',
      de: 'In welchem Jahr fiel die Berliner Mauer?'
    },
    options: {
      it: ['1989', '1987', '1991', '1993'],
      en: ['1989', '1987', '1991', '1993'],
      es: ['1989', '1987', '1991', '1993'],
      fr: ['1989', '1987', '1991', '1993'],
      de: ['1989', '1987', '1991', '1993']
    },
    correctAnswer: 0
  },
  {
    id: 'l6_q2',
    level: 6,
    category: 'Tech',
    question: {
      it: 'Chi è stato il co-fondatore di Microsoft insieme a Paul Allen?',
      en: 'Who was the co-founder of Microsoft alongside Paul Allen?',
      es: '¿Quién fue el cofundador de Microsoft junto a Paul Allen?',
      fr: 'Qui était le cofondateur de Microsoft aux côtés de Paul Allen ?',
      de: 'Wer war der Mitbegründer von Microsoft neben Paul Allen?'
    },
    options: {
      it: ['Bill Gates', 'Steve Jobs', 'Mark Zuckerberg', 'Elon Musk'],
      en: ['Bill Gates', 'Steve Jobs', 'Mark Zuckerberg', 'Elon Musk'],
      es: ['Bill Gates', 'Steve Jobs', 'Mark Zuckerberg', 'Elon Musk'],
      fr: ['Bill Gates', 'Steve Jobs', 'Mark Zuckerberg', 'Elon Musk'],
      de: ['Bill Gates', 'Steve Jobs', 'Mark Zuckerberg', 'Elon Musk']
    },
    correctAnswer: 0
  },

  // --- LEVEL 7 (€4,000) ---
  {
    id: 'l7_q1',
    level: 7,
    category: 'Biology',
    question: {
      it: 'Qual è l\'organo umano più grande per superficie?',
      en: 'What is the largest human organ by surface area?',
      es: '¿Cuál es el órgano humano más grande en superficie?',
      fr: 'Quel est le plus grand organe humain en surface ?',
      de: 'Was ist das größte menschliche Organ nach Oberfläche?'
    },
    options: {
      it: ['Pelle', 'Fegato', 'Cervello', 'Intestino'],
      en: ['Skin', 'Liver', 'Brain', 'Intestine'],
      es: ['Piel', 'Hígado', 'Cerebro', 'Intestino'],
      fr: ['Peau', 'Foie', 'Cerveau', 'Intestin'],
      de: ['Haut', 'Leber', 'Gehirn', 'Darm']
    },
    correctAnswer: 0
  },

  // --- LEVEL 8 (€8,000) ---
  {
    id: 'l8_q1',
    level: 8,
    category: 'Physics',
    question: {
      it: 'Qual è la velocità della luce nel vuoto approssimata?',
      en: 'What is the approximate speed of light in a vacuum?',
      es: '¿Cuál es la velocidad aproximada de la luz en el vacío?',
      fr: 'Quelle est la vitesse approximative de la lumière dans le vide ?',
      de: 'Was ist die ungefähre Lichtgeschwindigkeit im Vakuum?'
    },
    options: {
      it: ['300.000 km/s', '150.000 km/s', '500.000 km/s', '1.000.000 km/s'],
      en: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'],
      es: ['300.000 km/s', '150.000 km/s', '500.000 km/s', '1.000.000 km/s'],
      fr: ['300 000 km/s', '150 000 km/s', '500 000 km/s', '1 000 000 km/s'],
      de: ['300.000 km/s', '150.000 km/s', '500.000 km/s', '1.000.000 km/s']
    },
    correctAnswer: 0
  },

  // --- LEVEL 9 (€16,000) ---
  {
    id: 'l9_q1',
    level: 9,
    category: 'Music',
    question: {
      it: 'Quante sinfonie ha composto Ludwig van Beethoven?',
      en: 'How many symphonies did Ludwig van Beethoven compose?',
      es: '¿Cuántas sinfonías compuso Ludwig van Beethoven?',
      fr: 'Combien de symphonies Ludwig van Beethoven a-t-il composées ?',
      de: 'Wie viele Symphonien hat Ludwig van Beethoven komponiert?'
    },
    options: {
      it: ['9', '5', '7', '12'],
      en: ['9', '5', '7', '12'],
      es: ['9', '5', '7', '12'],
      fr: ['9', '5', '7', '12'],
      de: ['9', '5', '7', '12']
    },
    correctAnswer: 0
  },

  // --- LEVEL 10 (€32,000 - SAFETY CHECKPOINT) ---
  {
    id: 'l10_q1',
    level: 10,
    category: 'Geography',
    question: {
      it: 'Qual è il fiume più lungo del mondo secondo le recenti misurazioni satellitari?',
      en: 'Which is the longest river in the world according to recent satellite data?',
      es: '¿Cuál es el río más largo del mundo según mediciones satelitales recientes?',
      fr: 'Quel est le plus long fleuve du monde selon les récentes mesures satellites ?',
      de: 'Welcher ist der längste Fluss der Welt nach neuesten Satellitenmessungen?'
    },
    options: {
      it: ['Rio delle Amazzoni', 'Nilo', 'Mississippi', 'Yangtze'],
      en: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'],
      es: ['Amazonas', 'Nilo', 'Misisipi', 'Yangtsé'],
      fr: ['Amazone', 'Nil', 'Mississippi', 'Yangtsé'],
      de: ['Amazonas', 'Nil', 'Mississippi', 'Jangtsekiang']
    },
    correctAnswer: 0
  },

  // --- LEVEL 11 (€64,000) ---
  {
    id: 'l11_q1',
    level: 11,
    category: 'History',
    question: {
      it: 'Chi fu il primo imperatore romano?',
      en: 'Who was the first Roman Emperor?',
      es: '¿Quién fue el primer emperador romano?',
      fr: 'Qui fut le premier empereur romain ?',
      de: 'Wer war der erste römische Kaiser?'
    },
    options: {
      it: ['Ottaviano Augusto', 'Giulio Cesare', 'Tiberio', 'Nerone'],
      en: ['Augustus', 'Julius Caesar', 'Tiberius', 'Nero'],
      es: ['Augusto', 'Julio César', 'Tiberio', 'Nerón'],
      fr: ['Auguste', 'Jules César', 'Tibère', 'Néron'],
      de: ['Augustus', 'Julius Cäsar', 'Tiberius', 'Nero']
    },
    correctAnswer: 0
  },

  // --- LEVEL 12 (€125,000) ---
  {
    id: 'l12_q1',
    level: 12,
    category: 'Chemistry',
    question: {
      it: 'Quale gas costituisce circa il 78% dell\'atmosfera terrestre?',
      en: 'Which gas makes up approximately 78% of Earth\'s atmosphere?',
      es: '¿Qué gas constituye aproximadamente el 78% de la atmósfera terrestre?',
      fr: 'Quel gaz compose environ 78 % de l\'atmosphère terrestre ?',
      de: 'Welches Gas macht etwa 78 % der Erdatmosphäre aus?'
    },
    options: {
      it: ['Azoto', 'Ossigeno', 'Anidride Carbonica', 'Argon'],
      en: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Argon'],
      es: ['Nitrógeno', 'Oxígeno', 'Dióxido de Carbono', 'Argón'],
      fr: ['Azote', 'Oxygène', 'Dioxyde de Carbone', 'Argon'],
      de: ['Stickstoff', 'Sauerstoff', 'Kohlendioxid', 'Argon']
    },
    correctAnswer: 0
  },

  // --- LEVEL 13 (€250,000) ---
  {
    id: 'l13_q1',
    level: 13,
    category: 'Technology',
    question: {
      it: 'In quale anno è stato lanciato il primo iPhone di Apple?',
      en: 'In which year was the original Apple iPhone launched?',
      es: '¿En qué año se lanzó el primer iPhone de Apple?',
      fr: 'En quelle année le premier iPhone d\'Apple a-t-il été lancé ?',
      de: 'In welchem Jahr wurde das erste Apple iPhone auf den Markt gebracht?'
    },
    options: {
      it: ['2007', '2005', '2009', '2010'],
      en: ['2007', '2005', '2009', '2010'],
      es: ['2007', '2005', '2009', '2010'],
      fr: ['2007', '2005', '2009', '2010'],
      de: ['2007', '2005', '2009', '2010']
    },
    correctAnswer: 0
  },

  // --- LEVEL 14 (€500,000) ---
  {
    id: 'l14_q1',
    level: 14,
    category: 'Medicine',
    question: {
      it: 'Chi ha scoperto la Penicillina nel 1928?',
      en: 'Who discovered Penicillin in 1928?',
      es: '¿Quién descubrió la Penicilina en 1928?',
      fr: 'Qui a découvert la Pénicilline en 1928 ?',
      de: 'Wer entdeckte 1928 das Penicillin?'
    },
    options: {
      it: ['Alexander Fleming', 'Louis Pasteur', 'Robert Koch', 'Edward Jenner'],
      en: ['Alexander Fleming', 'Louis Pasteur', 'Robert Koch', 'Edward Jenner'],
      es: ['Alexander Fleming', 'Louis Pasteur', 'Robert Koch', 'Edward Jenner'],
      fr: ['Alexander Fleming', 'Louis Pasteur', 'Robert Koch', 'Edward Jenner'],
      de: ['Alexander Fleming', 'Louis Pasteur', 'Robert Koch', 'Edward Jenner']
    },
    correctAnswer: 0
  },

  // --- LEVEL 15 (€1,000,000 - CLASSIC FINAL) ---
  {
    id: 'l15_q1',
    level: 15,
    category: 'Ancient History',
    question: {
      it: 'Quale antica meraviglia del mondo si trovava nell\'isola di Rodi?',
      en: 'Which Ancient Wonder of the World was located on the island of Rhodes?',
      es: '¿Qué antigua maravilla del mundo se encontraba en la isla de Rodas?',
      fr: 'Quelle ancienne merveille du monde se trouvait sur l\'île de Rhodes ?',
      de: 'Welches antike Weltwunder befand sich auf der Insel Rhodos?'
    },
    options: {
      it: ['Colosso di Rodi', 'Faro di Alessandria', 'Mausoleo di Alicarnasso', 'Statua di Zeus'],
      en: ['Colossus of Rhodes', 'Lighthouse of Alexandria', 'Mausoleum at Halicarnassus', 'Statue of Zeus'],
      es: ['Coloso de Rodas', 'Faro de Alejandría', 'Mausoleo de Halicarnaso', 'Estatua de Zeus'],
      fr: ['Colosse de Rhodes', 'Phare d\'Alexandrie', 'Mausolée d\'Halicarnasse', 'Statue de Zeus'],
      de: ['Koloss von Rhodos', 'Leuchtturm von Alexandria', 'Mausoleum von Halikarnassos', 'Statue des Zeus']
    },
    correctAnswer: 0,
    explanation: {
      it: 'Il Colosso di Rodi era una gigantesca statua di bronzo del dio Elio, eretta nel 280 a.C.',
      en: 'The Colossus of Rhodes was a giant bronze statue of the titan Helios erected in 280 BC.',
      es: 'El Coloso de Rodas era una estatua gigante de bronce del dios Helio erigida en el 280 a.C.',
      fr: 'Le Colosse de Rhodes était une statue géante en bronze du dieu Hélios érigée en 280 av. J.-C.',
      de: 'Der Koloss von Rhodos war eine riesige Bronzestatue des Sonnengottes Helios aus dem Jahr 280 v. Chr.'
    }
  },

  // --- LEVEL 16 TO 25 (SUPER MILIONARIO EXTRA LEVELS) ---
  {
    id: 'l16_q1',
    level: 16,
    category: 'Astrophysics',
    question: {
      it: 'Qual è il punto di non ritorno attorno a un buco nero chiamato in fisica?',
      en: 'What is the point of no return around a black hole called in physics?',
      es: '¿Cómo se llama en física el punto de no retorno alrededor de un agujero negro?',
      fr: 'Comment appelle-t-on en physique le point de non-retour autour d\'un trou noir ?',
      de: 'Wie nennt man in der Physik den Punkt ohne Wiederkehr um ein Schwarzes Loch?'
    },
    options: {
      it: ['Orizzonte degli Eventi', 'Singolarità', 'Disco di Accrescimento', 'Raggio di Schwarzschild'],
      en: ['Event Horizon', 'Singularity', 'Accretion Disk', 'Schwarzschild Radius'],
      es: ['Horizonte de Sucesos', 'Singularidad', 'Disco de Acreción', 'Radio de Schwarzschild'],
      fr: ['Horizon des Événements', 'Singularité', 'Disque d\'Accrétion', 'Rayon de Schwarzschild'],
      de: ['Ereignishorizont', 'Singularität', 'Akkretionsscheibe', 'Schwarzschild-Radius']
    },
    correctAnswer: 0
  },
  {
    id: 'l20_q1',
    level: 20,
    category: 'Classical Music',
    question: {
      it: 'Quale opera lirica di Giuseppe Verdi debuttò al Cairo nel 1871?',
      en: 'Which opera by Giuseppe Verdi premiered in Cairo in 1871?',
      es: '¿Qué ópera de Giuseppe Verdi se estrenó en El Cairo en 1871?',
      fr: 'Quel opéra de Giuseppe Verdi a été créé au Caire en 1871 ?',
      de: 'Welche Oper von Giuseppe Verdi feierte 1871 in Kairo Premiere?'
    },
    options: {
      it: ['Aida', 'La Traviata', 'Rigoletto', 'Nabucco'],
      en: ['Aida', 'La Traviata', 'Rigoletto', 'Nabucco'],
      es: ['Aida', 'La Traviata', 'Rigoletto', 'Nabucco'],
      fr: ['Aida', 'La Traviata', 'Rigoletto', 'Nabucco'],
      de: ['Aida', 'La Traviata', 'Rigoletto', 'Nabucco']
    },
    correctAnswer: 0
  },
  {
    id: 'l25_q1',
    level: 25,
    category: 'Quantum Physics',
    question: {
      it: 'Quale costante fisica fondamentale lega l\'energia di un fotone alla sua frequenza?',
      en: 'Which fundamental physical constant relates a photon\'s energy to its frequency?',
      es: '¿Qué constante física fundamental relaciona la energía de un fotón con su frecuencia?',
      fr: 'Quelle constante physique fondamentale relie l\'énergie d\'un photon à sa fréquence ?',
      de: 'Welche fundamentale physikalische Konstante verknüpft die Energie eines Photons mit seiner Frequenz?'
    },
    options: {
      it: ['Costante di Planck', 'Costante di Boltzmann', 'Costante di Avogadro', 'Costante di Rydberg'],
      en: ['Planck Constant', 'Boltzmann Constant', 'Avogadro Constant', 'Rydberg Constant'],
      es: ['Constante de Planck', 'Constante de Boltzmann', 'Constante de Avogadro', 'Constante de Rydberg'],
      fr: ['Constante de Planck', 'Constante de Boltzmann', 'Constante d\'Avogadro', 'Constante de Rydberg'],
      de: ['Planck-Konstante', 'Boltzmann-Konstante', 'Avogadro-Konstante', 'Rydberg-Konstante']
    },
    correctAnswer: 0
  }
];

export const CLASSIC_PRIZE_LADDER = [
  100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000
];

export const SUPER_PRIZE_LADDER = [
  100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000,
  50000, 100000, 200000, 350000, 500000, 750000, 1000000,
  1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000, 5000000
];

export const SAFETY_CHECKPOINTS_CLASSIC = [5, 10]; // Level index 5 (€1,000) and 10 (€32,000)
export const SAFETY_CHECKPOINTS_SUPER = [5, 10, 17]; // Level index 5, 10, 17

/**
 * Shuffles question options dynamically and computes new correct answer index
 */
export function shuffleQuestionOptions(q: Question): { question: Question; shuffledOptions: LocalizedOptions; correctIndex: number } {
  const originalCorrectIndex = q.correctAnswer;
  const indices = [0, 1, 2, 3];

  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const newCorrectIndex = indices.indexOf(originalCorrectIndex);

  const shuffleLang = (langKey: 'it' | 'en' | 'es' | 'fr' | 'de'): [string, string, string, string] => {
    const orig = q.options[langKey];
    return [orig[indices[0]], orig[indices[1]], orig[indices[2]], orig[indices[3]]];
  };

  const shuffledOptions: LocalizedOptions = {
    it: shuffleLang('it'),
    en: shuffleLang('en'),
    es: shuffleLang('es'),
    fr: shuffleLang('fr'),
    de: shuffleLang('de')
  };

  return {
    question: {
      ...q,
      correctAnswer: newCorrectIndex,
      options: shuffledOptions
    },
    shuffledOptions,
    correctIndex: newCorrectIndex
  };
}

/**
 * Pick a random question for a given level, fallback to available pool if exact level not found.
 */
export function getRandomQuestionForLevel(targetLevel: number, usedIds: Set<string>): Question {
  let candidates = QUESTION_BANK.filter((q) => q.level === targetLevel && !usedIds.has(q.id));

  // Fallback if all candidates for exact level used
  if (candidates.length === 0) {
    candidates = QUESTION_BANK.filter((q) => q.level === targetLevel);
  }

  // General fallback if level doesn't exist
  if (candidates.length === 0) {
    candidates = QUESTION_BANK;
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  const picked = candidates[randomIndex];

  const shuffled = shuffleQuestionOptions(picked);
  return shuffled.question;
}

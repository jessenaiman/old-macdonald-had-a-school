import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');
const FRAMEWORK = 'Ontario Kindergarten Program';
const SOURCE = 'The Kindergarten Program (2016), Ontario Ministry of Education — files.ontario.ca/books/kindergarten-program-en.pdf, Appendix pp. 306-318';

const FRAMES = {
  BC: 'Belonging and Contributing',
  SRWB: 'Self-Regulation and Well-Being',
  DLMB: 'Demonstrating Literacy and Mathematics Behaviours',
  PSI: 'Problem Solving and Innovating',
};

// code: [full_text, frames[]]
const OES = {
  'OE 1': ['communicate with others in a variety of ways, for a variety of purposes, and in a variety of contexts', ['BC', 'SRWB', 'DLMB', 'PSI']],
  'OE 2': ['demonstrate independence, self-regulation, and a willingness to take responsibility in learning and other endeavours', ['SRWB']],
  'OE 3': ['identify and use social skills in play and other contexts', ['BC', 'SRWB']],
  'OE 4': ['demonstrate an ability to use problem-solving skills in a variety of contexts, including social contexts', ['BC', 'SRWB', 'PSI']],
  'OE 5': ['demonstrate an understanding of the diversity among individuals and families and within schools and the wider community', ['BC']],
  'OE 6': ['demonstrate an awareness of their own health and well-being', ['SRWB', 'DLMB']],
  'OE 7': ['participate actively and regularly in a variety of activities that require the application of movement concepts', ['SRWB']],
  'OE 8': ['develop movement skills and concepts as they use their growing bodies to move in a variety of ways and in a variety of contexts', ['SRWB']],
  'OE 9': ['demonstrate literacy behaviours that enable beginning readers to make sense of a variety of texts', ['DLMB', 'PSI']],
  'OE 10': ['demonstrate literacy behaviours that enable beginning writers to communicate with others', ['DLMB', 'PSI']],
  'OE 11': ['demonstrate an understanding and critical awareness of a variety of written materials that are read by and with their educators', ['DLMB']],
  'OE 12': ['demonstrate an understanding and critical awareness of media texts', ['DLMB']],
  'OE 13': ['use the processes and skills of an inquiry stance (i.e., questioning, planning, predicting, observing, and communicating)', ['PSI']],
  'OE 14': ['demonstrate an awareness of the natural and built environment through hands-on investigations, observations, questions, and representations of their findings', ['DLMB', 'PSI']],
  'OE 15': ['demonstrate an understanding of numbers, using concrete materials to explore and investigate counting, quantity, and number relationships', ['DLMB']],
  'OE 16': ['measure, using non-standard units of the same size, and compare objects, materials, and spaces in terms of their length, mass, capacity, area, and temperature, and explore ways of measuring the passage of time, through inquiry and play-based learning', ['DLMB']],
  'OE 17': ['describe, sort, classify, build, and compare two-dimensional shapes and three-dimensional figures, and describe the location and movement of objects through investigation', ['DLMB']],
  'OE 18': ['recognize, explore, describe, and compare patterns, and extend, translate, and create them, using the core of a pattern and predicting what comes next', ['DLMB']],
  'OE 19': ['collect, organize, display, and interpret data to solve problems and to communicate information, and explore the concept of probability in everyday contexts', ['DLMB']],
  'OE 20': ['apply the mathematical processes to support the development of mathematical thinking, to demonstrate understanding, and to communicate thinking and learning in mathematics, while engaged in play-based learning and in other contexts', ['DLMB', 'PSI']],
  'OE 21': ['express their responses to a variety of forms of drama, dance, music, and visual arts from various cultures and communities', ['BC']],
  'OE 22': ['communicate their thoughts and feelings, and their theories and ideas, through various art forms', ['BC', 'SRWB', 'DLMB', 'PSI']],
  'OE 23': ['use problem-solving strategies, on their own and with others, when experimenting with the skills, materials, processes, and techniques used in drama, dance, music, and visual arts', ['PSI']],
  'OE 24': ['use technological problem-solving skills, on their own and with others, in the process of creating and designing (i.e., questioning, planning, constructing, analysing, redesigning, and communicating)', ['PSI']],
  'OE 25': ['demonstrate a sense of identity and a positive self-image', ['BC']],
  'OE 26': ['develop an appreciation of the multiple perspectives encountered within groups, and of ways in which they themselves can contribute to groups and to group well-being', ['BC']],
  'OE 27': ['recognize bias in ideas and develop the self-confidence to stand up for themselves and others against prejudice and discrimination', ['BC']],
  'OE 28': ['demonstrate an awareness of their surroundings', ['BC']],
  'OE 29': ['demonstrate an understanding of the natural world and the need to care for and respect the environment', ['BC']],
  'OE 30': ['demonstrate an awareness of themselves as dramatists, actors, dancers, artists, and musicians through engagement in the arts', ['BC']],
  'OE 31': ['demonstrate knowledge and skills gained through exposure to and engagement in drama, dance, music, and visual arts', ['BC']],
};

// code → text (SEs inherit their OE's parent; frames recorded on OE for accuracy)
const SES = {
  'SE 1.1': 'explore sounds, rhythms, and language structures, with guidance and on their own',
  'SE 1.2': 'listen and respond to others, both verbally and non-verbally (e.g., using the arts, using signs, using gestures and body language), for a variety of purposes (e.g., to exchange ideas, express feelings, offer opinions) and in a variety of contexts (e.g., after read-alouds and shared reading or writing experiences; while solving a class math problem; in imaginary or exploratory play; in the learning areas; while engaged in games and outdoor play; while making scientific observations of plants and animals outdoors)',
  'SE 1.3': 'use and interpret gestures, tone of voice, and other non-verbal means to communicate and respond (e.g., respond to non-verbal cues from the educator; vary tone of voice when dramatizing; name feelings and recognize how someone else might be feeling)',
  'SE 1.4': 'sustain interactions in different contexts (e.g., with materials, with other children, with adults)',
  'SE 1.5': 'use language (verbal and non-verbal communication) in various contexts to connect new experiences with what they already know (e.g., contribute ideas during shared or interactive writing; contribute to conversations in learning areas; respond to educator prompts)',
  'SE 1.6': 'use language (verbal and non-verbal communication) to communicate their thinking, to reflect, and to solve problems',
  'SE 1.7': 'use specialized vocabulary for a variety of purposes (e.g., terms for things they are building or equipment they are using)',
  'SE 1.8': 'ask questions for a variety of purposes (e.g., for direction, for assistance, to innovate on an idea, to obtain information, for clarification, for help in understanding something, out of curiosity about something, to make meaning of a new situation) and in different contexts (e.g., during discussions and conversations with peers and adults; before, during, and after read-aloud and shared reading experiences; while exploring the schoolyard or local park; in small groups, in learning areas)',
  'SE 1.9': 'describe personal experiences, using vocabulary and details appropriate to the situation',
  'SE 1.10': 'retell experiences, events, and familiar stories in proper sequence (e.g., orally; in new and creative ways; using drama, visual arts, non-verbal communication, and representations; in a conversation)',
  'SE 1.11': 'demonstrate an awareness that words can rhyme, can begin or end with the same sound, and are composed of phonemes that can be manipulated to create new words',
  'SE 2.1': 'demonstrate self-reliance and a sense of responsibility (e.g., make choices and decisions on their own; take care of personal belongings; know when to seek assistance; know how to get materials they need)',
  'SE 2.2': 'demonstrate a willingness to try new experiences (e.g., experiment with new materials/tools; try out activities in a different learning area; select and persist with things that are challenging; experiment with writing) and to adapt to new situations (e.g., having visitors in the classroom, having a different educator occasionally, going on a field trip, riding the school bus)',
  'SE 2.3': 'demonstrate self-motivation, initiative, and confidence in their approach to learning by selecting and completing learning tasks (e.g., choose learning tasks independently; try something new; persevere with tasks)',
  'SE 2.4': 'demonstrate self-control (e.g., be aware of and label their own emotions; accept help to calm down; calm themselves down after being upset) and adapt behaviour to different contexts within the school environment (e.g., follow routines and rules in the classroom, gym, library, playground)',
  'SE 2.5': 'develop empathy for others, and acknowledge and respond to each other\'s feelings (e.g., tell an adult when another child is hurt/sick/upset; have an imaginary conversation with a tree or an insect; role-play emotions with dolls and puppets)',
  'SE 3.1': 'act and talk with peers and adults by expressing and accepting positive messages (e.g., use an appropriate tone of voice and gestures; give compliments; give and accept constructive criticism)',
  'SE 3.2': 'demonstrate the ability to take turns during activity and discussions (e.g., while engaged in play with others; in discussions with peers and adults)',
  'SE 3.3': 'demonstrate an awareness of ways of making and keeping friends (e.g., sharing, listening, talking, helping, entering into play or joining a group with guidance from the educators)',
  'SE 4.1': 'use a variety of strategies to solve problems, including problems arising in social situations (e.g., trial and error, checking and guessing, cross-checking – looking ahead and back to find material to add or remove)',
  'SE 5.1': 'demonstrate respect and consideration for individual differences and alternative points of view (e.g., help a friend who speaks another language; adapt behaviour to accommodate a classmate\'s ideas)',
  'SE 5.2': 'talk about events and retell, dramatize, or represent stories or experiences that reflect their own heritage and cultural background and the heritage and cultural backgrounds of others (e.g., traditions, cultural events, myths, Canadian symbols, everyday experiences)',
  'SE 6.1': 'demonstrate an understanding of the effects of healthy, active living on the mind and body (e.g., choose a balance of active and quiet activities throughout the day; remember to have a snack; drink water when thirsty)',
  'SE 6.2': 'investigate the benefits of nutritious foods (e.g., nutritious snacks, healthy meals, foods from various cultures) and explore ways of ensuring healthy eating (e.g., choosing nutritious food for meals and snacks, avoiding foods to which they are allergic)',
  'SE 6.3': 'practise and discuss appropriate personal hygiene that promotes personal, family, and community health',
  'SE 6.4': 'discuss what action to take when they feel unsafe or uncomfortable, and when and how to seek assistance in unsafe situations (e.g., acting in response to inappropriate touching; seeking assistance from an adult they know and trust, from 911, or from playground monitors; identifying substances that are harmful to the body)',
  'SE 6.5': 'discuss and demonstrate in play what makes them happy and unhappy, and why',
  'SE 7.1': 'participate actively in creative movement and other daily physical activities (e.g., dance, games, outdoor play, fitness breaks)',
  'SE 7.2': 'demonstrate persistence while engaged in activities that require the use of both large and small muscles (e.g., tossing and catching beanbags, skipping, lacing, drawing)',
  'SE 7.3': 'demonstrate strategies for engaging in cooperative play in a variety of games and activities',
  'SE 8.1': 'demonstrate spatial awareness in activities that require the use of large muscles',
  'SE 8.2': 'demonstrate control of large muscles with and without equipment (e.g., climb and balance on playground equipment; roll, throw, and catch a variety of balls; demonstrate balance and coordination during parachute games; hop, slide, wheel, or gallop in the gym or outdoors)',
  'SE 8.3': 'demonstrate balance, whole-body and hand-eye coordination, and flexibility in movement (e.g., run, jump, and climb; walk on the balance beam; play beach-ball tennis; catch a ball; play hopscotch)',
  'SE 8.4': 'demonstrate control of small muscles (e.g., use a functional grip when writing) while working in a variety of learning areas (e.g., sand table, water table, visual arts area) and when using a variety of materials or equipment (e.g., using salt trays, stringing beads, painting with paintbrushes, drawing, cutting paper, using a keyboard, using bug viewers, using a mouse, writing with a crayon or pencil)',
  'SE 8.5': 'demonstrate spatial awareness by doing activities that require the use of small muscles',
  'SE 9.1': 'use reading behaviours to make sense of familiar and unfamiliar texts in print (e.g., use pictures; use knowledge of oral language structures, of a few high-frequency words, and/or of sound-symbol relationships)',
  'SE 10.1': 'demonstrate an interest in writing (e.g., choose a variety of writing materials, such as adhesive notes, labels, envelopes, coloured paper, markers, crayons, pencils) and choose to write in a variety of contexts (e.g., draw or record ideas in learning areas)',
  'SE 10.2': 'demonstrate an awareness that text can convey ideas or messages (e.g., ask the educator to write out new words for them)',
  'SE 10.3': 'write simple messages (e.g., a grocery list on unlined paper, a greeting card made on a computer, labels for a block or sand construction), using a combination of pictures, symbols, knowledge of the correspondence between letters and sounds (phonics), and familiar words',
  'SE 10.4': 'use classroom resources to support their writing (e.g., a classroom word wall that is made up of children\'s names, words from simple patterned texts, and words used repeatedly in shared or interactive writing experiences; signs or charts in the classroom; picture dictionaries; alphabet cards; books)',
  'SE 10.5': 'experiment with a variety of simple writing forms for different purposes and in a variety of contexts',
  'SE 10.6': 'communicate ideas about personal experiences and/or familiar stories, and experiment with personal voice in their writing (e.g., make a story map of "The Three Little Pigs" and retell the story individually to a member of the educator team during a writing conference)',
  'SE 11.1': 'demonstrate an interest in reading (e.g., expect to find meaning in pictures and text; choose to look at reading materials; respond to texts read by the educator team; reread familiar text; confidently make attempts at reading)',
  'SE 11.2': 'identify personal preferences in reading materials (e.g., choose fiction and non-fiction books, magazines, posters, or computerized interactive texts that they enjoy) in different contexts (e.g., educator team read-alouds, shared experiences in reading books, independent reading time)',
  'SE 11.3': 'demonstrate an awareness of basic book conventions and concepts of print when a text is read aloud or when they are beginning to read print (e.g., start at the beginning of the book; recognize that print uses letters, words, spaces between words, and sentences; understand that printed materials contain messages)',
  'SE 11.4': 'respond to a variety of materials that have been read aloud to them (e.g., paint, draw, or construct models of characters or settings)',
  'SE 11.5': 'make predictions regarding an unfamiliar text that is read by and with the educator team, using prior experience, knowledge of familiar texts, and general knowledge of the world around them (e.g., use the cover pictures and/or title to determine the topic and/or text form)',
  'SE 11.6': 'use prior knowledge to make connections (e.g., to new experiences, to other books, to events in the world) to help them understand a diverse range of materials read by and with the educator team',
  'SE 11.7': 'use illustrations to support comprehension of texts that are read by and with the educator(s)',
  'SE 11.8': 'demonstrate knowledge of most letters of the alphabet in different contexts (e.g., use a variety of capital and lower-case manipulative letters in letter play; identify letters by name on signs and labels in chart stories, in poems, in big books, on traffic signs; identify the sound that is represented by a letter; identify a word that begins with the letter)',
  'SE 11.9': 'retell, orally or with non-verbal communication, familiar experiences or stories in proper sequence (e.g., in new and creative ways, using drama, visual arts, non-verbal communication, and representations; in a conversation)',
  'SE 11.10': 'retell information from non-fiction materials that have been read by and with the educator team in a variety of contexts (e.g., read-alouds, shared reading experiences), using pictures and/or props',
  'SE 12.1': 'respond critically to animated works (e.g., cartoons in which animals talk, movies in which animals go to school)',
  'SE 12.2': 'communicate their ideas, verbally and non-verbally, about a variety of media materials (e.g., describe their feelings in response to seeing a DVD or a video; dramatize messages from a safety video or poster; paint pictures in response to an advertisement or CD)',
  'SE 13.1': 'state problems and pose questions in different contexts and for different reasons (e.g., before, during, and after inquiries)',
  'SE 13.2': 'make predictions and observations before and during investigations',
  'SE 13.3': 'select and use materials to carry out their own explorations',
  'SE 13.4': 'communicate results and findings from individual and group investigations (e.g., explain and/or show how they made their structure; state simple conclusions from an experiment; record ideas using pictures, numbers, and labels)',
  'SE 14.1': 'ask questions about and describe some natural occurrences, using their own observations and representations (e.g., drawings, writing)',
  'SE 14.2': 'sort and classify groups of living and non-living things in their own way (e.g., using sorting tools such as hula hoops, sorting circles, paper plates, T-charts, Venn diagrams)',
  'SE 14.3': 'recognize, explore, describe, and compare patterns in the natural and built environment (e.g., patterns in the design of buildings, in flowers, on animals\' coats)',
  'SE 15.1': 'investigate (e.g., using a number line, a hundreds carpet, a board game with numbered squares) the idea that a number\'s position in the counting sequence determines its magnitude (e.g., the quantity is greater when counting forward and less when counting backward)',
  'SE 15.2': 'investigate some concepts of quantity and equality through identifying and comparing sets with more, fewer, or the same number of objects (e.g., find out which of two cups contains more or fewer beans [i.e., the concept of one-to-one correspondence]; investigate the ideas of more, less, or the same, using concrete materials such as counters or five and ten frames; recognize that the last number counted represents the number of objects in the set [i.e., the concept of cardinality])',
  'SE 15.3': 'make use of one-to-one correspondence in counting objects and matching groups of objects',
  'SE 15.4': 'demonstrate an understanding of the counting concepts of stable order (i.e., the concept that the counting sequence is always the same – 1 is followed by 2, 2 by 3, and so on) and of order irrelevance (i.e., the concept that the number of objects in a set will be the same regardless of which object is used to begin the counting)',
  'SE 15.5': 'subitize quantities to 5 without having to count, using a variety of materials (e.g., dominoes, dot plates, dice, number of fingers) and strategies (e.g., composing or decomposing numbers)',
  'SE 15.6': 'use information to estimate the number in a small set (e.g., apply knowledge of quantity; use a common reference such as a five frame; subitize)',
  'SE 15.7': 'explore and communicate the function/purpose of numbers in a variety of contexts (e.g., use magnetic and sandpaper numerals to represent the number of objects in a set [to indicate quantity]; line up toys and manipulatives, and identify the first, second, and so on [to indicate ordinality]; use footsteps to discover the distance between the door and the sink [to measure]; identify a favourite sports player: "My favourite player is number twenty-four" [to label or name])',
  'SE 15.8': 'explore different Canadian coins, using coin manipulatives (e.g., role-play the purchasing of items at the store in the dramatic play area; determine which coin will purchase more – a loonie or a quarter)',
  'SE 15.9': 'compose and decompose quantities to 10 (e.g., make multiple representations of numbers using two or more colours of linking cubes, blocks, dot strips, and other manipulatives; play "shake and spill" games)',
  'SE 15.10': 'investigate addition and subtraction in everyday experiences and routines through the use of modelling strategies and manipulatives (e.g., join two sets of objects, one containing a greater number than the other, and count all the objects; separate out the smaller number of objects and determine how many remain) and counting strategies (e.g., use a counting sequence to determine how many objects there are altogether; count backward from the largest number to determine how many objects remain)',
  'SE 16.1': 'select an attribute to measure (e.g., capacity), determine an appropriate non-standard unit of measure (e.g., a small margarine container), and measure and compare two or more objects (e.g., determine which of two other containers holds the most water)',
  'SE 16.2': 'investigate strategies and materials used when measuring with non-standard units of measure (e.g., why feet used to measure length must be placed end to end with no gaps and not overlapping, and must all be the same size; why scoops used to measure water must be the same size and be filled to the top)',
  'SE 17.1': 'explore, sort, and compare the attributes (e.g., reflective symmetry) and the properties (e.g., number of faces) of traditional and non-traditional two-dimensional shapes and three-dimensional figures (e.g., when sorting and comparing a variety of triangles: notice similarities in number of sides, differences in side lengths, sizes of angles, sizes of the triangles themselves; see smaller triangles in a larger triangle)',
  'SE 17.2': 'communicate an understanding of basic spatial relationships (e.g., use terms such as "above/below", "in/out", "forward/backward"; use visualization, perspective, and movements [flips/reflections, slides/translations, and turns/rotations]) in their conversations and play, in their predictions and visualizations, and during transitions and routines',
  'SE 17.3': 'investigate and explain the relationship between two-dimensional shapes and three-dimensional figures in objects they have made (e.g., explain that the flat surface of a cube is a square)',
  'SE 18.1': 'identify and describe informally the repeating nature of patterns in everyday contexts (e.g., patterns in nature such as morning-noon-night, the four seasons, or the arrangement of leaves on the stem of a plant; the pattern on a piece of clothing; the pattern made by floor tiles; the pattern of words in a book or poem; the pattern on a calendar or in a schedule; the pattern of the beat or rhythm in songs), using appropriate terminology (e.g., "goes before", "goes after", "repeats") and gestures (e.g., pointing, nodding, using slap/claps)',
  'SE 18.2': 'explore and extend patterns (e.g., fill in missing elements of a repeating pattern) using a variety of materials (e.g., beads, shapes, words in a poem, beat and rhythm in music, objects from the natural world)',
  'SE 18.3': 'identify the smallest unit (the core) of a pattern (e.g., ABBABBABB – the core is ABB) and describe why it is important (e.g., it helps us to know what comes next; it helps us make generalizations)',
  'SE 18.4': 'create and translate patterns (e.g., re-represent "red-blue-blue, red-blue-blue, red-blue-blue" as "circle-square-square, circle-square-square, circle-square-square")',
  'SE 19.1': 'ask questions that can be answered through data collection (e.g., "What is your favourite …?"; "How many pets do our classmates have?"; "Which month had the most snowy days – January or February?"), collect data, and make representations of their observations, using graphs (e.g., concrete graphs such as people graphs or graphs using representational objects; picture graphs)',
  'SE 19.2': 'interpret data presented in graphs (e.g., "There are more children in the pizza line than in the hot dog line – that means more children like pizza"; "The blue bar is twice as long as the yellow bar"; "There were twice as many snowy days in January as snowy days in February") and draw conclusions (e.g., "We need to order more pizza than hot dogs for play day"; "January was more snowy than February")',
  'SE 19.3': 'respond to and pose questions about data collection and graphs',
  'SE 20.1': 'demonstrate an understanding of number relationships for numbers from 0 to 10, through investigation (e.g., show small quantities using fingers or manipulatives)',
  'SE 20.2': 'use, read, and represent whole numbers to 10 in a variety of meaningful contexts (e.g., use a hundreds chart to read whole numbers; use magnetic and sandpaper numerals to represent the number of objects in a set; put the house number on a house built in the blocks area; find and recognize numbers in the environment; write numerals on imaginary bills at the restaurant in the dramatic play area)',
  'SE 20.3': 'compose pictures, designs, shapes, and patterns, using two-dimensional shapes; predict and explore reflective symmetry in two-dimensional shapes (e.g., visualize and predict what will happen when a square, a circle, or a rectangle is folded in half); and decompose two-dimensional shapes into smaller shapes and rearrange the pieces into other shapes, using various tools and materials (e.g., stickers, geoboards, pattern blocks, geometric puzzles, tangrams, a computer program)',
  'SE 20.4': 'build three-dimensional structures using a variety of materials and identify the three-dimensional figures their structure contains',
  'SE 20.5': 'investigate and describe how objects can be collected, grouped, and organized according to similarities and differences (e.g., attributes like size, colour)',
  'SE 20.6': 'use mathematical language (e.g., "always/sometimes/never"; "likely/unlikely") in informal discussions to describe probability in familiar, everyday situations (e.g., "Sometimes Kindergarten children like pizza more than hot dogs"; "It is likely that January will be a snowy month")',
  'SE 21.1': 'express their responses to drama and dance (e.g., by moving, by making connections to their experiences with drama and dance, by talking about drama and dance)',
  'SE 21.2': 'dramatize rhymes, stories, legends, and folk tales from various cultures and communities (e.g., use actions, pictures, words, or puppets to tell a story in the dramatic play area or in the blocks area)',
  'SE 21.3': 'express their responses to music by moving, by making connections to their own experiences, or by talking about the musical form',
  'SE 21.4': 'respond to music from various cultures and communities (e.g., folk songs, Indigenous chants, songs in different languages, Inuit throat singing)',
  'SE 21.5': 'express their responses to visual art forms by making connections to their own experiences or by talking about the form',
  'SE 21.6': 'respond to a variety of visual art forms (e.g., paintings, fabrics, sculptures, illustrations) from various cultures and communities',
  'SE 22.1': 'communicate their ideas about something (e.g., a book, the meaning of a word, an event or an experience, a mathematical pattern, a motion or movement) through music, drama, dance, and/or the visual arts',
  'SE 23.1': 'use problem-solving skills and their imagination to create drama and dance (e.g., try out different voices for parts of a story or chant; find different ways to move to music, trying to connect the movement with the mood and speed of the music; create a sequence of movements)',
  'SE 23.2': 'use problem-solving skills and their imagination to create visual art forms (e.g., choose materials to make a three-dimensional structure stable; choose an alternative way to fasten their materials if the first way is unsuccessful)',
  'SE 23.3': 'use problem-solving skills and their imagination to create music (e.g., experiment with different instruments to create a rhythm pattern to accompany a familiar song; contribute to making a variation on a familiar song with the class)',
  'SE 23.4': 'communicate their understanding of something (e.g., a familiar story, an experience, a song, a play) by representing their ideas and feelings through the arts',
  'SE 24.1': 'identify practices that ensure their personal safety and the safety of others, and demonstrate an understanding of the importance of these practices',
  'SE 24.2': 'state problems and pose questions as part of the process of creating and designing',
  'SE 24.3': 'make predictions and observations as part of the process of creating and designing',
  'SE 24.4': 'select and use tools, equipment, and materials to construct things',
  'SE 24.5': 'communicate and record results and findings either individually or in groups (e.g., explain and/or show how they made their structure; record ideas using pictures, words, numbers on labels, or in charts)',
  'SE 25.1': 'recognize personal interests, strengths, and accomplishments',
  'SE 25.2': 'identify and talk about their own interests and preferences',
  'SE 25.3': 'express their thoughts (e.g., about a science discovery, about something they have made) and share experiences (e.g., experiences at home, cultural experiences)',
  'SE 26.1': 'understand that everyone belongs to a group/community (e.g., a family, a class, a religious community), and that people can belong to more than one group/community at a time',
  'SE 26.2': 'understand that different groups/communities may have different ways of being and working together',
  'SE 26.3': 'describe, both verbally and non-verbally, ways in which they contribute to the various groups to which they belong',
  'SE 27.1': 'develop strategies for standing up for themselves, and demonstrate the ability to apply behaviours that enhance their personal well-being, comfort, and self-acceptance and the well-being, comfort, and self-acceptance of others (e.g., speaking confidently, stating boundaries, making choices)',
  'SE 27.2': 'think critically about fair/unfair and biased behaviour towards both themselves and others, and act with compassion and kindness',
  'SE 27.3': 'recognize discriminatory and inequitable practices and behaviours and respond appropriately',
  'SE 28.1': 'recognize people in their community and talk about what they do (e.g., farmer, park ranger, police officer, nurse, Indigenous healer, store clerk, engineer, baker)',
  'SE 28.2': 'recognize places and buildings within their community, both natural and human-made, and talk about their functions (e.g., farm, church, hospital, mosque, sweat lodge, arena, mine, cave)',
  'SE 28.3': 'develop an awareness of ways in which people adapt to the places in which they live (e.g., children in cities may live in high-rise buildings and use sidewalks and the subway; children in the country may take the bus to school)',
  'SE 29.1': 'identify similarities and differences between local environments (e.g., between a park and a pond, between a schoolyard and a field)',
  'SE 29.2': 'describe what would happen if something in the local environment changed (e.g., if trees in the park were cut down, if the pond dried up, if native flowers were planted in the school garden)',
  'SE 29.3': 'identify ways in which they can care for and show respect for the environment (e.g., feeding the birds in winter, reusing and recycling, turning off unnecessary lights at home, walking to school instead of getting a ride)',
  'SE 29.4': 'participate in environmentally friendly experiences in the classroom and the schoolyard (e.g., plant and tend to plants; use local products for snack time; properly sort recycling)',
  'SE 30.1': 'demonstrate an awareness of personal interests and a sense of accomplishment in drama and dance (e.g., contribute their own ideas to role playing; create their own actions to accompany a song or chant and/or follow actions created by a classmate); in music (e.g., contribute their own ideas to a class song); and in visual arts (e.g., create a sculpture from clay)',
  'SE 30.2': 'explore a variety of tools, materials, and processes of their own choice (e.g., blocks, puppets, flashlights, streamers, castanets, rhythm sticks, natural and recycled materials) to create drama, dance, music, and visual art forms in familiar and new ways',
  'SE 31.1': 'explore different elements of drama (e.g., character, setting, dramatic structure) and dance (e.g., rhythm, space, shape)',
  'SE 31.2': 'explore different elements (e.g., beat, sound quality, speed, volume) of music (e.g., clap the beat of a song; tap their feet on carpet and then on tile, and compare the sounds; experiment with different instruments to accompany a song)',
  'SE 31.3': 'explore different elements of design (e.g., colour, line, shape, texture, form) in visual arts',
};

console.log(`Data: ${Object.keys(OES).length} OEs, ${Object.keys(SES).length} SEs`);

// ── 1. Capture old topic links before cleanup ──────────────────────────────
const oldLinks = db.prepare(`
  SELECT ts.topic_id, s.code
  FROM topic_standards ts
  JOIN standards s ON s.id = ts.standard_id
  WHERE s.framework = ?
`).all(FRAMEWORK);
console.log(`Old links to be remapped: ${oldLinks.length}`);

// ── 2. Delete fabricated rows (links first, then standards for FK) ────────
const delLinks = db.prepare(`
  DELETE FROM topic_standards
  WHERE standard_id IN (SELECT id FROM standards WHERE framework = ?)
`).run(FRAMEWORK);
console.log(`Deleted ${delLinks.changes} old topic links`);

const del = db.prepare('DELETE FROM standards WHERE framework = ?').run(FRAMEWORK);
console.log(`Deleted ${del.changes} fabricated rows`);

// ── 3. Insert real OEs ─────────────────────────────────────────────────────
const insert = db.prepare(
  'INSERT INTO standards (framework, code, full_text, source, frames, parent_standard_id) VALUES (?, ?, ?, ?, ?, ?)'
);
const oeIdMap = {};
for (const [code, [text, frames]] of Object.entries(OES)) {
  const r = insert.run(FRAMEWORK, code, text, SOURCE, frames.join(','), null);
  oeIdMap[code] = r.lastInsertRowid;
}
console.log(`Inserted ${Object.keys(OES).length} OEs`);

// ── 4. Insert real SEs (parent = their OE) ─────────────────────────────────
function oeParentFor(seCode) {
  const m = seCode.match(/^SE (\d+)\./);
  return m ? `OE ${m[1]}` : null;
}
let seCount = 0;
for (const [code, text] of Object.entries(SES)) {
  const parentCode = oeParentFor(code);
  const parentId = parentCode ? oeIdMap[parentCode] : null;
  if (!parentId) console.log(`  WARN: no OE parent for ${code}`);
  insert.run(FRAMEWORK, code, text, SOURCE, null, parentId);
  seCount++;
}
console.log(`Inserted ${seCount} SEs`);

// ── 5. Remap topic links by exact code match ───────────────────────────────
const newByCode = new Map();
for (const row of db.prepare("SELECT id, code FROM standards WHERE framework = ? AND code IS NOT NULL").all(FRAMEWORK)) {
  newByCode.set(row.code, row.id);
}
const insertLink = db.prepare('INSERT OR IGNORE INTO topic_standards (topic_id, standard_id) VALUES (?, ?)');
const deleteLink = db.prepare('DELETE FROM topic_standards WHERE topic_id = ? AND standard_id = ?');

let remapped = 0, unmatched = 0;
const unmatchedCodes = new Set();
for (const link of oldLinks) {
  const targetId = newByCode.get(link.code);
  if (targetId) {
    insertLink.run(link.topic_id, targetId);
    remapped++;
  } else {
    unmatched++;
    unmatchedCodes.add(link.code);
  }
}
console.log(`Remapped ${remapped} links by exact code`);
console.log(`Unmatched codes (need manual mapping): ${[...unmatchedCodes].join(', ') || 'none'}`);

// ── 6. Verify ──────────────────────────────────────────────────────────────
const check = db.prepare(`
  SELECT COUNT(*) as total,
         SUM(CASE WHEN full_text IS NOT NULL AND full_text != '' THEN 1 ELSE 0 END) as withText
  FROM standards WHERE framework = ?
`).get(FRAMEWORK);
console.log(`\nVerify: ${check.withText}/${check.total} rows with text`);
const frames = db.prepare("SELECT DISTINCT frames FROM standards WHERE framework = ? AND frames IS NOT NULL ORDER BY frames").all(FRAMEWORK);
console.log('Distinct frame sets:', frames.map(f => f.frames).join(' | '));
const linked = db.prepare(`
  SELECT COUNT(DISTINCT topic_id) as n FROM topic_standards ts
  JOIN standards s ON s.id = ts.standard_id WHERE s.framework = ?
`).get(FRAMEWORK);
console.log(`Topics still linked to OKP: ${linked.n}`);

db.close();
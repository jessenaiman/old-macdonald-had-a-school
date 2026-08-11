import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');
const FRAMEWORK = 'NGSS';
const SOURCE = 'Next Generation Science Standards (NGSS), nextgenscience.org — DCI Combined 11.6.13, grades K-3';

// code → [full_text, grade]
const PES = {
  // Kindergarten
  'K-PS2-1': ['Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls on the motion of an object.', 'K'],
  'K-PS2-2': ['Analyze data to determine if a design solution works as intended to change the speed or direction of an object with a push or a pull.', 'K'],
  'K-PS3-1': ['Make observations to determine the effect of sunlight on Earth\'s surface.', 'K'],
  'K-PS3-2': ['Use tools and materials to design and build a structure that will reduce the warming effect of sunlight on an area.', 'K'],
  'K-LS1-1': ['Use observations to describe patterns of what plants and animals (including humans) need to survive.', 'K'],
  'K-ESS2-1': ['Use and share observations of local weather conditions to describe patterns over time.', 'K'],
  'K-ESS2-2': ['Construct an argument supported by evidence for how plants and animals (including humans) can change the environment to meet their needs.', 'K'],
  'K-ESS3-1': ['Use a model to represent the relationship between the needs of different plants or animals (including humans) and the places they live.', 'K'],
  'K-ESS3-2': ['Ask questions to obtain information about the purpose of weather forecasting to prepare for, and respond to, severe weather.', 'K'],
  'K-ESS3-3': ['Communicate solutions that will reduce the impact of humans on the land, water, air, and/or other living things in the local environment.', 'K'],
  'K-2-ETS1-1': ['Ask questions, make observations, and gather information about a situation people want to change to define a simple problem that can be solved through the development of a new or improved object or tool.', 'K-2'],
  'K-2-ETS1-2': ['Develop a simple sketch, drawing, or physical model to illustrate how the shape of an object helps it function as needed to solve a given problem.', 'K-2'],
  'K-2-ETS1-3': ['Analyze data from tests of two objects designed to solve the same problem to compare the strengths and weaknesses of how each performs.', 'K-2'],
  // Grade 1
  '1-PS4-1': ['Plan and conduct investigations to provide evidence that vibrating materials can make sound and that sound can make materials vibrate.', '1'],
  '1-PS4-2': ['Make observations to construct an evidence-based account that objects can be seen only when illuminated.', '1'],
  '1-PS4-3': ['Plan and conduct an investigation to determine the effect of placing objects made with different materials in the path of a beam of light.', '1'],
  '1-PS4-4': ['Use tools and materials to design and build a device that uses light or sound to solve the problem of communicating over a distance.', '1'],
  '1-LS1-1': ['Use materials to design a solution to a human problem by mimicking how plants and/or animals use their external parts to help them survive, grow, and meet their needs.', '1'],
  '1-LS1-2': ['Read texts and use media to determine patterns in behavior of parents and offspring that help offspring survive.', '1'],
  '1-LS3-1': ['Make observations to construct an evidence-based account that young plants and animals are like, but not exactly like, their parents.', '1'],
  '1-ESS1-1': ['Use observations of the sun, moon, and stars to describe patterns that can be predicted.', '1'],
  '1-ESS1-2': ['Make observations at different times of year to relate the amount of daylight to the time of year.', '1'],
  // Grade 2
  '2-PS1-1': ['Plan and conduct an investigation to describe and classify different kinds of materials by their observable properties.', '2'],
  '2-PS1-2': ['Analyze data obtained from testing different materials to determine which materials have the properties that are best suited for an intended purpose.', '2'],
  '2-PS1-3': ['Make observations to construct an evidence-based account of how an object made of a small set of pieces can be disassembled and made into a new object.', '2'],
  '2-PS1-4': ['Construct an argument with evidence that some changes caused by heating or cooling can be reversed and some cannot.', '2'],
  '2-LS2-1': ['Plan and conduct an investigation to determine if plants need sunlight and water to grow.', '2'],
  '2-LS2-2': ['Develop a simple model that mimics the function of an animal in dispersing seeds or pollinating plants.', '2'],
  '2-LS4-1': ['Make observations of plants and animals to compare the diversity of life in different habitats.', '2'],
  '2-ESS1-1': ['Use information from several sources to provide evidence that Earth events can occur quickly or slowly.', '2'],
  '2-ESS2-1': ['Compare multiple solutions designed to slow or prevent wind or water from changing the shape of the land.', '2'],
  '2-ESS2-2': ['Develop a model to represent the shapes and kinds of land and bodies of water in an area.', '2'],
  '2-ESS2-3': ['Obtain information to identify where water is found on Earth and that it can be solid or liquid.', '2'],
  // Grade 3
  '3-PS2-1': ['Plan and conduct an investigation to provide evidence of the effects of balanced and unbalanced forces on the motion of an object.', '3'],
  '3-PS2-2': ['Make observations and/or measurements of an object\'s motion to provide evidence that a pattern can be used to predict future motion.', '3'],
  '3-PS2-3': ['Ask questions to determine cause and effect relationships of electric or magnetic interactions between two objects not in contact with each other.', '3'],
  '3-PS2-4': ['Define a simple design problem that can be solved by applying scientific ideas about magnets.', '3'],
  '3-LS1-1': ['Develop models to describe that organisms have unique and diverse life cycles but all have in common birth, growth, reproduction, and death.', '3'],
  '3-LS2-1': ['Construct an argument that some animals form groups that help members survive.', '3'],
  '3-LS3-1': ['Analyze and interpret data to provide evidence that plants and animals have traits inherited from parents and that variation of these traits exists in a group of similar organisms.', '3'],
  '3-LS3-2': ['Use evidence to support the explanation that traits can be influenced by the environment.', '3'],
  '3-LS4-1': ['Analyze and interpret data from fossils to provide evidence of the organisms and the environments in which they lived long ago.', '3'],
  '3-LS4-2': ['Use evidence to construct an explanation for how the variations in characteristics among individuals of the same species may provide advantages in surviving, finding mates, and reproducing.', '3'],
  '3-LS4-3': ['Construct an argument with evidence that in a particular habitat some organisms can survive well, some survive less well, and some cannot survive at all.', '3'],
  '3-LS4-4': ['Make a claim about the merit of a solution to a problem caused when the environment changes and the types of plants and animals that live there may change.', '3'],
  '3-ESS2-1': ['Represent data in tables and graphical displays to describe typical weather conditions expected during a particular season.', '3'],
  '3-ESS2-2': ['Obtain and combine information to describe climates in different regions of the world.', '3'],
  '3-ESS3-1': ['Make a claim about the merit of a design solution that reduces the impacts of a weather-related hazard.', '3'],
  '3-5-ETS1-1': ['Define a simple design problem reflecting a need or a want that includes specified criteria for success and constraints on materials, time, or cost.', '3-5'],
  '3-5-ETS1-2': ['Generate and compare multiple possible solutions to a problem based on how well each is likely to meet the criteria and constraints of the problem.', '3-5'],
  '3-5-ETS1-3': ['Plan and carry out fair tests in which variables are controlled and failure points are considered to identify aspects of a model or prototype that can be improved.', '3-5'],
};

console.log(`Captured ${Object.keys(PES).length} K-3 performance expectations`);

const existing = db.prepare("SELECT code, full_text FROM standards WHERE framework = ?").all(FRAMEWORK);
console.log(`Existing NGSS rows in DB: ${existing.length}`);
existing.forEach(e => console.log(`  ${e.code}: ${e.full_text ? 'HAS TEXT' : 'no text'}`));

db.close();
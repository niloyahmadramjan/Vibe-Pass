import { NextResponse } from "next/server";

export async function GET() {
const moviesData = {
  nowShowing: [
    {
      id: 1,
      title: "The Conjuring: Last Rites",
      poster: "https://i.ibb.co/XfvkDKMG/the-conjuring-last-rites-movie-poster.webp",
      overview: "Paranormal investigators Ed and Lorraine Warren confront one of their most terrifying cases. A gripping horror thriller filled with suspense, supernatural encounters, and a race against time.",
      release_date: "2023-07-21",
      vote_average: 7.8,
      genres: ["Horror","Thriller"]
    },
    {
      id: 2,
      title: "Magik Rompak",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "A young hero discovers a magical world filled with challenges and enchantments. Friendship, courage, and destiny are tested in this fantastical adventure.",
      release_date: "2023-08-10",
      vote_average: 8.1,
      genres: ["Adventure","Fantasy"]
    },
    {
      id: 3,
      title: "Demon Slayer (Japanese)",
      poster: "https://i.ibb.co/rXxPBBs/A4223810-1.jpg",
      overview: "Tanjiro embarks on a dangerous quest to avenge his family and save his sister Nezuko from a demon curse. Packed with stunning action and emotional depth.",
      release_date: "2023-09-01",
      vote_average: 8.9,
      genres: ["Action","Fantasy","Animation"]
    },
    {
      id: 4,
      title: "Demon Slayer (English)",
      poster: "https://i.ibb.co/rXxPBBs/A4223810-1.jpg",
      overview: "English dubbed version of Demon Slayer, allowing wider audiences to experience thrilling adventures, epic battles, and the fight against demons.",
      release_date: "2023-09-15",
      vote_average: 8.9,
      genres: ["Action","Fantasy","Animation"]
    },
    {
      id: 5,
      title: "Princess Mononoke",
      poster: "https://i.ibb.co/XfvkDKMG/the-conjuring-last-rites-movie-poster.webp",
      overview: "A young warrior becomes embroiled in the struggle between forest gods and human industry. Themes of nature, morality, and war are explored in this epic classic.",
      release_date: "1997-07-12",
      vote_average: 8.4,
      genres: ["Animation","Adventure","Fantasy"]
    },
    {
      id: 6,
      title: "Dead To Rights",
      poster: "https://i.ibb.co/XfvkDKMG/the-conjuring-last-rites-movie-poster.webp",
      overview: "A gritty action thriller following a cop seeking justice after personal loss. Filled with intense action, moral dilemmas, and suspenseful moments.",
      release_date: "2022-05-10",
      vote_average: 7.2,
      genres: ["Action","Crime"]
    },
    {
      id: 7,
      title: "Interstellar",
      poster: "https://i.ibb.co/XfvkDKMG/the-conjuring-last-rites-movie-poster.webp",
      overview: "A team of explorers travel through a wormhole in search of a new habitable planet, exploring love, sacrifice, and the limits of human endurance.",
      release_date: "2014-11-07",
      vote_average: 8.6,
      genres: ["Sci-Fi","Adventure"]
    },
    {
      id: 8,
      title: "Inception",
      poster: "https://i.ibb.co/rXxPBBs/A4223810-1.jpg",
      overview: "A skilled thief enters the subconscious of targets to steal secrets. A mind-bending thriller exploring dreams, reality, and the power of the human mind.",
      release_date: "2010-07-16",
      vote_average: 8.8,
      genres: ["Action","Sci-Fi","Thriller"]
    }
  ],
upcoming: [
    {
      id: 9,
      title: "Gladiator II",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "The epic sequel continues the journey of the legendary gladiator, facing new challenges, rivalries, and battles for honor in a politically turbulent world.",
      release_date: "2025-03-01",
      vote_average: 0,
      genres: ["Action","Drama"]
    },
    {
      id: 10,
      title: "Moana 2",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Moana embarks on another ocean adventure, uncovering hidden islands, mystical challenges, and embracing her destiny as a navigator and leader.",
      release_date: "2025-06-15",
      vote_average: 0,
      genres: ["Animation","Adventure","Family"]
    },
    {
      id: 11,
      title: "Inside Out 2",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "The emotions are back! Joy, Sadness, Anger, Fear, and Disgust navigate new challenges as Riley grows up and faces fresh adventures.",
      release_date: "2025-07-20",
      vote_average: 0,
      genres: ["Animation","Comedy","Family"]
    },
    {
      id: 12,
      title: "Kung Fu Panda 4",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Po returns with new adventures, kung fu challenges, and valuable lessons of courage, friendship, and determination.",
      release_date: "2025-08-10",
      vote_average: 0,
      genres: ["Animation","Action","Comedy"]
    },
    {
      id: 13,
      title: "Mufasa: The Lion King",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Explore Mufasa's early life as he learns the values of leadership, family, and the circle of life in the Pride Lands.",
      release_date: "2025-09-12",
      vote_average: 0,
      genres: ["Animation","Family","Adventure"]
    },
    {
      id: 14,
      title: "Frozen 3",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Elsa and Anna return in another magical journey, discovering new lands, friends, and challenges while embracing the magic within themselves.",
      release_date: "2025-12-01",
      vote_average: 0,
      genres: ["Animation","Family","Fantasy"]
    },
    {
      id: 15,
      title: "Avengers: Secret Wars",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "The Avengers unite against a new multiverse threat, teaming with old and new heroes to protect Earth and multiple realities from destruction.",
      release_date: "2025-11-25",
      vote_average: 0,
      genres: ["Action","Adventure","Family"]
    },
    {
      id: 16,
      title: "Guardians of the Galaxy Vol. 3",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "The Guardians face personal challenges and cosmic threats as they navigate the galaxy, testing friendships and courage in high-stakes adventures.",
      release_date: "2025-05-02",
      vote_average: 0,
      genres: ["Action","Adventure","Sci-Fi"]
    }
  ],

  trending: [
    {
      id: 17,
      title: "Joker: Folie à Deux",
      poster: "https://i.ibb.co/XfvkDKMG/the-conjuring-last-rites-movie-poster.webp",
      overview: "The dark psychological tale of Joker continues, exploring chaos, mental instability, and the thin line between comedy and tragedy.",
      release_date: "2024-10-04",
      vote_average: 8.5,
      genres: ["Crime","Drama","Thriller"]
    },
    {
      id: 18,
      title: "Deadpool & Wolverine",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "An action-packed adventure with Deadpool and Wolverine joining forces. Full of humor, thrilling fights, and unexpected twists.",
      release_date: "2024-12-20",
      vote_average: 8.2,
      genres: ["Action","Comedy"]
    },
    {
      id: 19,
      title: "The Batman",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Batman faces new threats in Gotham City, uncovering corruption, criminal masterminds, and dark secrets testing his detective skills.",
      release_date: "2025-02-14",
      vote_average: 8.7,
      genres: ["Action","Crime","Thriller"]
    },
    {
      id: 20,
      title: "Oppenheimer",
      poster: "https://i.ibb.co/XfvkDKMG/the-conjuring-last-rites-movie-poster.webp",
      overview: "The story of J. Robert Oppenheimer and the development of the atomic bomb, exploring ambition, ethics, and the cost of scientific discovery.",
      release_date: "2024-07-18",
      vote_average: 8.9,
      genres: ["Biography","Drama","History"]
    },
    {
      id: 21,
      title: "Spider-Man: No Way Home",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Spider-Man deals with multiverse threats, unexpected villains, and the challenges of balancing hero duties with personal life.",
      release_date: "2024-12-17",
      vote_average: 8.3,
      genres: ["Action","Adventure","Sci-Fi"]
    },
    {
      id: 22,
      title: "Avatar: The Way of Water",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Jake Sully and Neytiri navigate new threats on Pandora, exploring family, conflict, and survival in a visually stunning world.",
      release_date: "2025-01-10",
      vote_average: 8.4,
      genres: ["Action","Adventure","Fantasy"]
    },
    {
      id: 23,
      title: "Doctor Strange: Multiverse of Madness 2",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Doctor Strange explores the multiverse, encountering alternate realities, dark magic, and moral dilemmas threatening existence itself.",
      release_date: "2025-03-28",
      vote_average: 0,
      genres: ["Action","Adventure","Fantasy"]
    },
    {
      id: 24,
      title: "Thor: Love and Thunder 2",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Thor returns to face new cosmic threats and reunite with old allies, balancing heroics with personal growth and challenges.",
      release_date: "2025-07-04",
      vote_average: 0,
      genres: ["Action","Adventure","Fantasy"]
    }
  ],
  kids: [
    {
      id: 25,
      title: "Kung Fu Panda 4",
      poster: "https://i.ibb.co.com/cXyv2MSk/images-14.jpg",
      overview: "Po returns to the Valley of Peace, facing new enemies and adventures, learning important lessons about courage, friendship, and determination.",
      release_date: "2025-08-10",
      vote_average: 0,
      genres: ["Animation","Action","Comedy"]
    },
    {
      id: 26,
      title: "Mufasa: The Lion King",
      poster: "https://i.ibb.co.com/cXyv2MSk/images-14.jpg",
      overview: "Follow Mufasa's early life as he learns the values of leadership, family, and the circle of life in the Pride Lands.",
      release_date: "2025-09-12",
      vote_average: 0,
      genres: ["Animation","Family","Adventure"]
    },
    {
      id: 27,
      title: "Toy Story 5",
      poster: "https://i.ibb.co.com/cXyv2MSk/images-14.jpg",
      overview: "Woody, Buzz, and the gang go on a brand new adventure to a mysterious land, learning lessons about friendship, loyalty, and growing up.",
      release_date: "2025-05-20",
      vote_average: 0,
      genres: ["Animation","Family","Comedy"]
    },
    {
      id: 28,
      title: "The Secret Life of Pets 3",
      poster: "https://i.ibb.co.com/cXyv2MSk/images-14.jpg",
      overview: "Max and friends embark on a new adventure outside their neighborhood, discovering surprises, friendships, and hilarious situations.",
      release_date: "2025-06-18",
      vote_average: 0,
      genres: ["Animation","Comedy","Family"]
    },
    {
      id: 29,
      title: "Minions: The Rise of Gru 2",
      poster: "https://i.ibb.co.com/DPFY53Mj/MV5-BZTAz-MTky-Nm-Qt-NTMz-ZS00-MTM1-LWI4-Yz-Et-Mj-Vl-Yj-U0-ZWI5-Y2-Iz-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX100.jpg",
      overview: "Gru and the Minions face new supervillain challenges, learning teamwork, mischief, and unexpected heroism in hilarious adventures.",
      release_date: "2025-07-22",
      vote_average: 0,
      genres: ["Animation","Comedy","Family"]
    },
    {
      id: 30,
      title: "Paw Patrol: The Movie 2",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "The Paw Patrol team faces a big city adventure, solving problems and learning teamwork, bravery, and leadership along the way.",
      release_date: "2025-08-05",
      vote_average: 0,
      genres: ["Animation","Family","Adventure"]
    },
    {
      id: 31,
      title: "Finding Dory 2",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Dory continues her oceanic journey with friends, discovering new places, solving challenges, and embracing family and friendship.",
      release_date: "2025-09-10",
      vote_average: 0,
      genres: ["Animation","Family","Adventure"]
    },
    {
      id: 32,
      title: "Shrek 5",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Shrek and friends return for a new fairy tale adventure, facing comedic challenges, magical creatures, and learning important life lessons.",
      release_date: "2025-10-12",
      vote_average: 0,
      genres: ["Animation","Comedy","Family"]
    }
  ],

  family: [
    {
      id: 33,
      title: "Frozen 3",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Elsa and Anna return in another magical journey, discovering new lands, friends, and challenges while embracing the magic within themselves.",
      release_date: "2025-12-01",
      vote_average: 0,
      genres: ["Animation","Family","Fantasy"]
    },
    {
      id: 34,
      title: "Avengers: Secret Wars",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "The Avengers unite against a multiverse threat, teaming up with old and new heroes to save Earth and alternate realities from destruction.",
      release_date: "2025-11-25",
      vote_average: 0,
      genres: ["Action","Adventure","Family"]
    },
    {
      id: 35,
      title: "The Incredibles 3",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTg0-NTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "The Parr family returns for new superhero adventures, balancing family life with saving the world and facing new villains.",
      release_date: "2025-06-14",
      vote_average: 0,
      genres: ["Animation","Action","Family"]
    },
    {
      id: 36,
      title: "Encanto 2",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "The Madrigal family faces new magical challenges, learning more about their gifts, family bonds, and the power of love and resilience.",
      release_date: "2025-07-21",
      vote_average: 0,
      genres: ["Animation","Family","Musical"]
    },
    {
      id: 37,
      title: "Spider-Man: Into the Spider-Verse 2",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Miles Morales teams up with new and old Spider-People to stop a multiverse threat, facing action, humor, and self-discovery.",
      release_date: "2025-08-30",
      vote_average: 0,
      genres: ["Animation","Action","Family"]
    },
    {
      id: 38,
      title: "Luca 2",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Luca and friends explore new adventures on the Italian Riviera, discovering friendship, courage, and magical secrets beneath the waves.",
      release_date: "2025-09-05",
      vote_average: 0,
      genres: ["Animation","Family","Adventure"]
    },
    {
      id: 39,
      title: "Raya and the Last Dragon 2",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Raya continues her journey to unite Kumandra, facing new enemies, challenges, and learning about trust, courage, and leadership.",
      release_date: "2025-10-11",
      vote_average: 0,
      genres: ["Animation","Action","Family"]
    },
    {
      id: 40,
      title: "Big Hero 7",
      poster: "https://i.ibb.co/x8L41fvJ/MV5-BYTI3-Yj-E4-MTIt-Yjlh-OS00-Yzk0-LTgt-Yzc0-NDI5-Nm-M1-Nz-Bm-Xk-Ey-Xk-Fqc-Gc-V1-FMjpg-UX1000.jpg",
      overview: "Hiro and Baymax embark on new adventures in San Fransokyo, discovering challenges, technology, and the power of friendship and teamwork.",
      release_date: "2025-11-18",
      vote_average: 0,
      genres: ["Animation","Action","Family"]
    }
  ]

};



  return NextResponse.json(moviesData);
}

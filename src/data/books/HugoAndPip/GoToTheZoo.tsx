import type { Book } from '../types'

const BASE_PATH_COVER = '/images/bookSeries/HugoAndPip/GoToTheZoo/'
const BASE_PATH = '/images/bookSeries/HugoAndPip/GoToTheZoo/pages' 

export const GoToTheZoo: Book = {
  id: 'pip-hugo-go-to-the-zoo',
  seriesId: 'pip-hugo',
  title: 'Pip and Hugo Go to the Zoo',
  coverImage: `${BASE_PATH_COVER}/cover.png`,
  coverImageLandscape:`${BASE_PATH_COVER}/coverLandscape.png`,
  pages: [
    {
      pageNumber: 1,
      imageBasePath: `${BASE_PATH}/page_1`,
      lines: [
        'Pip looks at Hugo and says, “Can we go to the zoo?”',
        'Hugo smiles at Pip and nods.',
      ],
      meta: { wordCount: 18 },
    },
    {
      pageNumber: 2,
      imageBasePath: `${BASE_PATH}/page_2`,
      lines: [
        'Pip and Hugo walk on the path.',
        'They go to the big zoo gate.',
      ],
      meta: { wordCount: 14 },
    },
    {
      pageNumber: 3,
      imageBasePath: `${BASE_PATH}/page_3`,
      lines: [
        'They see a small booth and a line.',
        'Pip says, “What are they doing?”',
      ],
      meta: { wordCount: 14 },
    },
    {
      pageNumber: 4,
      imageBasePath: `${BASE_PATH}/page_4`,
      lines: [
        'Hugo says, “They wait and pay to go in.”',
        'Pip nods and waits with Hugo.',
      ],
      meta: { wordCount: 15 },
    },
    {
      pageNumber: 5,
      imageBasePath: `${BASE_PATH}/page_5`,
      lines: [
        'Inside, Pip sees a big sign.',
        'It shows paths and places to go.',
      ],
      meta: { wordCount: 13 },
    },
    {
      pageNumber: 6,
      imageBasePath: `${BASE_PATH}/page_6`,
      lines: [
        'Pip stops near a pen where a big cat sits in the sun.',
        '“It is a lion”, says Hugo.',
      ],
      meta: { wordCount: 19 },
    },
    {
      pageNumber: 7,
      imageBasePath: `${BASE_PATH}/page_7`,
      lines: [
        'A keeper has meat in a tub.',
        'He tips it into the pen.',
      ],
      meta: { wordCount: 13 },
    },
    {
      pageNumber: 8,
      imageBasePath: `${BASE_PATH}/page_8`,
      lines: [
        'Pip says, “What is that man doing?”',
        'Hugo says, “The keeper is feeding the lion.”',
      ],
      meta: { wordCount: 15 },
    },
    {
      pageNumber: 9,
      imageBasePath: `${BASE_PATH}/page_9`,
      lines: [
        'They walk on and see a huge elephant.',
        'It sprays water high in the air.',
      ],
      meta: { wordCount: 15 },
    },
    {
      pageNumber: 10,
      imageBasePath: `${BASE_PATH}/page_10`,
      lines: [
        'A keeper pours water in a pool.',
        'The water splashes and shines.',
      ],
      meta: { wordCount: 12 },
    },
    {
      pageNumber: 11,
      imageBasePath: `${BASE_PATH}/page_11`,
      lines: [
        'Pip says, “What is the water for?”',
        'Hugo says, “The elephant drinks it and it helps him wash.”',
      ],
      meta: { wordCount: 18 },
    },
    {
      pageNumber: 12,
      imageBasePath: `${BASE_PATH}/page_12`,
      lines: [
        'Pip can hear noises and see small monkeys.',
        'They run and jump and play with a tyre.',
      ],
      meta: { wordCount: 17 },
    },
    {
      pageNumber: 13,
      imageBasePath: `${BASE_PATH}/page_13`,
      lines: [
        'A keeper fixes the tyre swings.',
        'The animals can swing again.',
      ],
      meta: { wordCount: 11 },
    },
    {
      pageNumber: 14,
      imageBasePath: `${BASE_PATH}/page_14`,
      lines: [
        'Pip says, “The keeper helps them, like at the other pens?”',
        'Hugo says, “Yes.”',
      ],
      meta: { wordCount: 14 },
    },
    {
      pageNumber: 15,
      imageBasePath: `${BASE_PATH}/page_15`,
      lines: [
        'Pip walks slowly and holds Hugo’s hand.',
        'It is time to go home.',
      ],
      meta: { wordCount: 13 },
    },
    {
      pageNumber: 16,
      imageBasePath: `${BASE_PATH}/page_16`,
      lines: [
        'Pip says, “The animals are safe at the zoo.”',
        'Pip says, “The keepers feed and help them.”',
      ],
      meta: { wordCount: 17 },
    },
  ],
}

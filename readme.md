
![dojoWORLDE](https://github.com/dpinones/wordle-dojo/assets/30808181/8fe85353-f696-4b1d-9648-24cc83102806)

## Dojo Wordle
Dojo Wordle has a daily word for you to guess, supports loading new words through the 'add_word_system.' When we load words using this system, they will automatically be set for the next day.

It has a points system and a ranking (unfortunately, the ranking is still a work in progress).

### Initial Setup

The repository already contains the `dojo-starter` as a submodule. Feel free to remove it if you prefer.

**Prerequisites:** First and foremost, ensure that Dojo is installed on your system. If it isn't, you can easily get it set up with:

```console
curl -L https://install.dojoengine.org | bash
```

Followed by:

```console
dojoup    
```

For an in-depth setup guide, consult the [Dojo book](https://book.dojoengine.org/getting-started/quick-start.html).

### Launch Dojo Wordle

After cloning the project, execute the following:

1. **Terminal 1 - Katana**:

```console
cd dojo && katana --disable-fee
```

2. **Terminal 2 - Contracts**:

```console
cd dojo && sozo build && sozo migrate
```

3. **Terminal 3 - Torii**:

```console
cd dojo-starter && torii --world 0x7d1f066a910bd86f532fa9ca66766722c20d47462fb99fb2fb0e1030262f9c5
```

4. **Terminal 4 - Client**:

```console
cd client && yarn && yarn dev
```

Upon completion, launch your browser and navigate to http://localhost:5173/.

![Screenshot from 2023-09-03 20-47-10](https://github.com/dpinones/wordle-dojo/assets/30808181/18335744-e9ce-407b-898d-d40b047e2bd0)


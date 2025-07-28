package com.openclassrooms.bobapp.service;

import com.openclassrooms.bobapp.data.JsonReader;
import com.openclassrooms.bobapp.model.Joke;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class JokeServiceTest {

    @Test
    void shouldReturnRandomJokeFromList() {
        // Mock JsonReader
        JsonReader mockJsonReader = mock(JsonReader.class);
        List<Joke> fakeJokes = Arrays.asList(
                new Joke("Blague 1", "Réponse 1"),
                new Joke("Blague 2", "Réponse 2")
        );

        when(mockJsonReader.getJokes()).thenReturn(fakeJokes);

        JokeService jokeService = new JokeService(mockJsonReader);

        Joke joke = jokeService.getRandomJoke();

        assertNotNull(joke);
        assertTrue(fakeJokes.contains(joke));
    }
}


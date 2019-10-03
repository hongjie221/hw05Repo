defmodule Memory.Game do

    def new do
      arr = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"]
      shuffledList = Enum.shuffle(arr)
      %{
        wrongTry: 0,
        score: 0,
        compareFirstValue: "",
        compareFirstId: [],
        
        game_board: [
          %{id: [0,0], value: Enum.at(shuffledList, 0), showAnswer: false},
          %{id: [0,1], value: Enum.at(shuffledList, 1), showAnswer: false},
          %{id: [0,2], value: Enum.at(shuffledList, 2), showAnswer: false},
          %{id: [0,3], value: Enum.at(shuffledList, 3), showAnswer: false},
          %{id: [1,0], value: Enum.at(shuffledList, 4), showAnswer: false},
          %{id: [1,1], value: Enum.at(shuffledList, 5), showAnswer: false},
          %{id: [1,2], value: Enum.at(shuffledList, 6), showAnswer: false},
          %{id: [1,3], value: Enum.at(shuffledList, 7), showAnswer: false},
          %{id: [2,0], value: Enum.at(shuffledList, 8), showAnswer: false},
          %{id: [2,1], value: Enum.at(shuffledList, 9), showAnswer: false},
          %{id: [2,2], value: Enum.at(shuffledList, 10), showAnswer: false},
          %{id: [2,3], value: Enum.at(shuffledList, 11), showAnswer: false},
          %{id: [3,0], value: Enum.at(shuffledList, 12), showAnswer: false},
          %{id: [3,1], value: Enum.at(shuffledList, 13), showAnswer: false},
          %{id: [3,2], value: Enum.at(shuffledList, 14), showAnswer: false},
          %{id: [3,3], value: Enum.at(shuffledList, 15), showAnswer: false}
        ],
      }
    end

    def client_view(game) do
      %{
         wrongTry: getWrongTry(game),
         score: Map.get(game, :score),
         compareFirstValue: Map.get(game, :compareFirstValue),
         compareFirstId: Map.get(game, :compareFirstId),
         game_board: Map.get(game, :game_board),
      }
    end

    def getWrongTry(game) do
      Map.get(game, :wrongTry)
    end

    def click(game, id) do
      i = List.first(id)
      j = List.last(id)
      if Map.get(game, :compareFirstValue) == "" do
        game = game
        |>Map.put(:compareFirstId, id)
        |>Map.put(:compareFirstValue, getValueById(game, i, j))
        |>Map.put(:game_board, setShowAnswerById(game, i, j))

      else
        if getValueById(game, i , j) == Map.get(game, :compareFirstValue) do
          newScore = Map.get(game, :score)
          secondNewScore = newScore + calculateScore(game)
          game = game
            |>Map.put(:game_board, setShowAnswerById(game, i, j))
            |>Map.put(:compareFirstId, [])
            |>Map.put(:compareFirstValue, "")
            |>Map.put(:score, secondNewScore)
            |>Map.put(:wrongTry, 0)
          
        else
          game = game
            |>Map.put(:game_board, setShowAnswerById(game, i, j))
     
        end
      end
    end

    def flipBack(game, id) do
        i = List.first(id)
        j = List.last(id)
        game = game
          |>Map.put(:game_board, setShowAnswerByTwoId(game,i, j))
          #|>Map.put(:game_board,setShowAnswerById(game, List.first(game.compareFirstId), 
                    #List.last(game.compareFirstId)))
          |>Map.put(:compareFirstId, [])
          |>Map.put(:compareFirstValue, "")
          |>Map.put(:wrongTry, Map.get(game, :wrongTry) + 1)
    end

    def restart(game, i) do
        game = new()
    end

    def getFirstCompareValue(game) do
      Map.get(game, :firstCompareValue)
    end

    def calculateScore(game) do
      if Map.get(game, :wrongTry) > 0 do
        1 / Map.get(game, :wrongTry)  * 10
      else
        10
      end 
    end

    def getValueById(game, i, j) do
      values = Enum.map(game.game_board, 
      fn (x) -> if(Map.get(x, :id) == [i, j]) do
          Map.get(x, :value) end
      end)
      list = Enum.filter(values, fn(x) -> x != nil end)
      List.first(list)
    end

    def setShowAnswerById(game, i, j) do
      board =Enum.map(game.game_board, 
      fn (x) -> if(Map.get(x, :id) == [i, j]) do
          Map.put(x, :showAnswer, !(Map.get(x, :showAnswer))) 
      else
          Map.put(x, :showAnswer, (Map.get(x, :showAnswer)))
      end
      end)
    end

    def setShowAnswerByTwoId(game, i, j) do
        board =Enum.map(game.game_board, 
        fn (x) -> if(Map.get(x, :id) == [i, j] || Map.get(x, :id) == Map.get(game, :compareFirstId)) do
            Map.put(x, :showAnswer, !(Map.get(x, :showAnswer))) 
        else
            Map.put(x, :showAnswer, (Map.get(x, :showAnswer)))
        end
        end)
      end
    
end
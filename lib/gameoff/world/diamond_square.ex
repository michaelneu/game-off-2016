defmodule Gameoff.World.DiamondSquare do
  def generate_map(size, bottom_left, top_left, top_right, bottom_right, rand_function) do
    start_map = %{{0, 0} => bottom_left, {0, size - 1} => top_left,
                  {size - 1, size - 1} => top_right, {size - 1, 0} => bottom_right}

     diamond_square(start_map, 0, 0, size, rand_function)
  end

  defp diamond_square(map, _x, _y, size, _rand_funcion) when size < 3 do
    map
  end
  defp diamond_square(map, x, y, size, rand_function) do
    half_size = round(size / 2 + 0.25) - 1
    center_x = x + half_size
    center_y = y + half_size

    map = Map.put(map, {center_x, center_y}, rand_function.(avg(map[{x, y}], map[{x + size - 1, y}], map[{x, y + size - 1}], map[{x + size - 1, y + size - 1}])))

    map =
      map
      |> Map.put({center_x, y}, rand_function.(avg(map[{x, y}], map[{x + size - 1, y}], map[{center_x, center_y}])))
      |> Map.put({center_x, y + size - 1}, rand_function.(avg(map[{x, y + size - 1}], map[{x + size - 1, y + size - 1}], map[{center_x, center_y}])))

    map
    |> Map.put({x, center_y}, rand_function.(avg(map[{x, y}], map[{x, y + size - 1}], map[{center_x, center_y}])))
    |> Map.put({x + size - 1, center_y}, rand_function.(avg(map[{x + size - 1, y}], map[{x + size - 1, y + size - 1}], map[{center_x, center_y}])))
    |> diamond_square(x, y, half_size + 1, rand_function)
    |> diamond_square(x + half_size, y, half_size + 1, rand_function)
    |> diamond_square(x, y + half_size, half_size + 1, rand_function)
    |> diamond_square(x + half_size, y + half_size, half_size + 1, rand_function)
  end

  defp avg(x1, x2, x3, x4) do
    (x1 + x2 + x3 + x4) / 4
  end
  defp avg(x1, x2, x3) do
    (x1 + x2 + x3) / 3
  end
end

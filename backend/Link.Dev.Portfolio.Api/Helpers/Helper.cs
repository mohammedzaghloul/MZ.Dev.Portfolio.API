namespace Link.Dev.Profolie.Api.Helpers
{
    public class Helper<T>
    {
        public static int SerachOfArray(T[] array, T index) 
        {
            if (array == null || index == null) return -1;
            for (int i = 0; i < array.Length; i++) 
            {
                if (array[i] != null && array[i]!.Equals(index))
                    return i;
            }
            return -1;
        }

    }
}

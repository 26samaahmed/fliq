<script>
  export let href = '/';
  export let name = '';
</script>

<a
  href={href}
  class="
    inline-flex items-center justify-center
    bg-[#D38A8A]
    hover:bg-[#F9D0D0]
    active:scale-95
    text-white
    text-sm sm:text-lg
    font-aldrich
    hover:text-[#333745]
    py-2
    px-5 sm:px-6
    border border-white
    hover:border-transparent
    rounded-full
    shadow-md
    hover:shadow-lg
    transition-all duration-200
  "
>
  {name}
</a>
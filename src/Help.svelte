<script>
  import { _, isLoading, locale } from 'svelte-i18n';

  /* Args */
  export let open = false;
</script>

<style>
</style>

{#if !$isLoading}
  <div
    class="fixed top-0 bottom-0 left-0 right-0 flex"
    on:click={() => {
      open = false;
    }}>
    <div
      class="relative bg-gray-300 border-4 border-gray-800 rounded flex-grow m-8 md:m-32 overflow-y-auto">
      <div
        on:click={(ev) => {
          ev.stopPropagation();
        }}
        class="pt-4 pb-12 px-6">
        <span
          class="underline text-sm absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
          on:click={() => {
            open = false;
          }}>{$_('close')}</span>
        <h1 class="text-xl font-bold mb-4">mmmapper</h1>
        {#if $locale === 'ja'}
          <h2 class="text-lg mb-2">本アプリケーションについて</h2>
          <p class="mb-2">
            mmmapper は TextAlive
            と連携して音楽情報に基づく表現を行えるプロジェクションマッピングソフトウェアです。
            「仮想と現実のハイブリッド」がコンセプトで、仮想空間内でだけでなく、プロジェクターを接続すれば実際に投影して楽しむことができます。
          </p>
          <h2 class="text-lg mb-2">利用について</h2>
          <p class="mb-2">
            本アプリケーションは
            <a
              target="_blank"
              class="link"
              href="https://developer.textalive.jp/">TextAlive および TextAlive
              App API</a>
            を利用しています。 利用にあたっては、<a
              target="_blank"
              class="link"
              href="https://github.com/TextAliveJp/textalive-app-api/blob/master/LICENSE.md">TextAlive
              App API ライセンス</a>に従って利用規約に同意する必要があります。
          </p>
        {:else}
          <h2 class="text-lg mb-2">About this application</h2>
          <p class="mb-2">
            mmmapper is a projection mapping software that works in combination
            with TextAlive to create expressions based on music information. It
            is a "virtual-real hybrid" software, which you can enjoy not only in
            the virtual space, but also in the real space with a projector.
          </p>
        {/if}
        {#if $locale === 'ja'}
          <h2 class="text-lg mb-2">利用について</h2>
          <p class="mb-2">
            本アプリケーションは
            <a
              target="_blank"
              class="link"
              href="https://developer.textalive.jp/">TextAlive および TextAlive
              App API</a>
            を利用しています。 利用にあたっては、<a
              target="_blank"
              class="link"
              href="https://github.com/TextAliveJp/textalive-app-api/blob/master/LICENSE.md">TextAlive
              App API ライセンス</a>に従って利用規約に同意する必要があります。
          </p>
        {:else}
          <h2 class="text-lg mb-2">Terms</h2>
          <p class="mb-2">
            This application depends on
            <a
              target="_blank"
              class="link"
              href="https://developer.textalive.jp/">TextAlive and TextAlive App
              API</a>. To use the application, you must agree to the terms of
            use in
            <a
              target="_blank"
              class="link"
              href="https://github.com/TextAliveJp/textalive-app-api/blob/master/LICENSE.md">TextAlive
              App API License</a>.
          </p>
        {/if}
        {#if $locale === 'ja'}
          <h2 class="text-lg mb-2">操作について</h2>
          <p>
            <b
              class="mr-1">仮想プロジェクター</b>黄色の枠で表示されているオブジェクトです。後部をドラッグして移動することができます。
          </p>
        {:else}
          <h2 class="text-lg mb-2">Usage</h2>
          <p>
            <b class="mr-1">Virtual Projector</b>The object framed in yellow.
            You can move it by dragging its rear part.
          </p>
        {/if}
        {#if $locale === 'ja'}
          <h2 class="text-lg mb-2 mt-2">メニューについて</h2>
          <p>
            <b class="mr-1">編集 (タブレット/PC)</b>仮想プロジェクターが出力する画面を編集します。
          </p>
          <p>
            <b class="mr-1">プロジェクターモード (PC)</b>プロジェクター投影用の画面を新しいウィンドウで開きます
            (Google Chrome推奨)
            。投影しながらの編集や再生はメインウィンドウから可能です。
          </p>
          <p><b class="mr-1">画質</b>画質を変更します。</p>
        {:else}
          <h2 class="text-lg mb-2 mt-2">Menu</h2>
          <p>
            <b class="mr-1">Edit (Tablet/PC)</b>Edit the screen output from the
            virtual projector.
          </p>
          <p>
            <b class="mr-1">Projector Mode (PC)</b>Open the view for projection
            in a new window. (Google Chrome is recommended.) You can edit the
            view or control the app in the main window during the projection.
          </p>
          <p><b class="mr-1">Resolution</b>Set resolution.</p>
        {/if}
        {#if $locale === 'ja'}
          <h2 class="text-lg mb-2 mt-2">リンク</h2>
        {:else}
          <h2 class="text-lg mb-2 mt-2">Links</h2>
        {/if}
        <ul class="list-disc pl-8">
          <li>
            <a
              target="_blank"
              class="link"
              href="https://github.com/nolze/mmmapper">nolze/mmmapper</a>
          </li>
          <li>
            <a
              target="_blank"
              class="link"
              href="https://magicalmirai.com/2020/procon/">初音ミク「マジカルミライ
              2020」プログラミング・コンテスト</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
{/if}

<script lang="ts">
  import { Button } from '../ui/button/index.js';
  import Comment from './Comment.svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';
  import type { CommentType } from "../../types";


  let comments: CommentType[];
  $: comments = $page.data.post.data.post.comments.nodes;
  $: parentComments = comments.filter((comment) => !comment.parentId);
  $: post_id = $page.data.post.data.post.databaseId;
  let commentsOpen = true;
  function toggleComments() {
    commentsOpen = !commentsOpen;
  }
</script>

{#if comments?.length > 0}
  <div class="mt-12">
    <Button on:click="{toggleComments}" class=" pl-0 font-bold hover:underline">
      Komentarze:{comments?.length}
    </Button>
  </div>
  {#if commentsOpen}
    <div in:fade="{{ duration: 500 }}" class="mt-12 grid gap-10">
      {#each parentComments as comment (comment.id)}
        <Comment
          comment="{comment}"
          post_id="{post_id}"
          responses="{comments.filter((c) => c.parentId === comment.id && c.id !== comment.id)}"
        />
      {/each}
    </div>
  {/if}
{/if}

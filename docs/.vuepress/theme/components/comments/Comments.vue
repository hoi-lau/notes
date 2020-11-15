<template>
  <div class="comments-wrapper">
    <!-- this is Comments -->
    <ClientOnly>
      <div id="comments" class="opinion">发表评论</div>
      <RichTextArea :placeholder-text="placeholderText" :reply-id="replyId" @resetReplyId="resetReplyId"/>
      <!-- render comment list -->
      <div class="comments-list-wrapper">
        <template v-if="commentsData.length > 0">
          <div class="font-bold">{{commentsData.length}}条评论</div>
          <div v-for="(item, index) in commentsData" class="comment-item" @click="handReply">
            <div class="comment-header">
              <div class="avatar">
                <!-- <img src="/favicon.ico"/> -->
                <i class="iconfont icon-ren" />
              </div>
              <div class="header-main">
                <div class="font-bold nick-name">{{item.nickname || 'anonymous'}}</div>
                <div class="human-bottom">
                  <span>{{dateFormate(item.timestamp)}}</span>
                  <span class="reply" :data-reply-id="item.id">回复</span>
                </div>
              </div>
              <div class="clear-fix" />
            </div>

            <div class="comment-body">
              <div class="comment-content" v-html="parseMarkdown(item.comment)"></div>
            </div>

            <template v-if="item.children && item.children.length > 0">
              <div v-for="child in item.children" class="comment-child">
                <div class="comment-header">
                  <div class="avatar">
                    <!-- <img src="/favicon.ico"/> -->
                    <i class="iconfont icon-ren" />
                  </div>
                  <div class="header-main">
                    <div class="font-bold nick-name">
                      <span>{{ child.nickname || 'anonymous'}}</span>
                      <span class="comment-item-reply">回复</span>
                      <span>{{ getParentNickName(child.parentId) || 'anonymous' }}</span>
                    </div>
                    <div class="human-bottom">
                      <span>{{dateFormate(child.timestamp)}}</span>
                      <span class="reply" :data-reply-id="child.id">回复</span>
                    </div>
                  </div>
                  <div class="clear-fix" />
                </div>

                <div class="comment-body">
                  <div class="comment-content" v-html="parseMarkdown(child.comment)"></div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <template v-else>暂无评论</template>
      </div>
    </ClientOnly>
  </div>
</template>

<script>
import RichTextArea from "./RichTextArea";
import Marked from "marked";
import { date2Str, humanfulDate } from "../../util";
export default {
  components: {
    RichTextArea
  },
  props: {
    commentsData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      placeholderText: "支持markdown",
      replyId: 0
    };
  },
  watch: {
    $route: (to, from) => {}
  },
  methods: {
    dateFormate(date) {
      return humanfulDate(date);
    },
    parseMarkdown(str) {
      return Marked(str);
    },
    handReply(e) {
      if (!e.srcElement.classList.contains("reply")) return;
      const { left, top } = document
        .getElementById("comments")
        .getBoundingClientRect();
      window.scrollTo(left, window.scrollY + top - 80);
      const replyId = e.srcElement.dataset["replyId"];
      // this.
      this.placeholderText = `@ ${this.getParentNickName(replyId)}`;
      this.replyId = parseInt(replyId)
      // return
    },
    resetReplyId() {
      this.replyId = 0
      this.placeholderText = '支持markdown'
    },
    getParentNickName(id) {
      let res = "";
      for (let i = 0; i < this.commentsData.length; i++) {
        const item = this.commentsData[i];
        if (item.id === parseInt(id)) {
          res = item.nickname;
          break;
        }
        if (item.children && item.children.length > 0) {
          for (let j = 0; j < item.children.length; j++) {
            if (item.children[j].id === parseInt(id)) {
              res = item.children[j].nickname;
              break;
            }
          }
          if (res) break;
        }
      }
      return res;
    }
  }
};
</script>
<style lang="stylus" scoped>
.opinion {
  font-size: 1.2rem;
  padding: 0.2rem 0 1rem 0.5rem;
  letter-spacing: 0.1rem;
}

.comments-list-wrapper {
  box-shadow: 0 1px 3px rgb(18 18 18 / 10%);
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 4px;
}

.comment-item {
  padding: 0.8rem;
  overflow: hidden;
  word-break: break-all;
  border-bottom: 1px solid #f6f6f6;
}

.comment-content {
  background-color: rgba(200, 200, 200, 0.2);
  padding: 0.4rem;
  margin: 0.2rem 0 0.2rem 2.5rem;

  &>>>p {
    margin: 0;
  }
}

.font-bold {
  font-weight: bold;
}

.comment-header {
  line-height: 1.5rem;

  .avatar {
    float: left;

    i {
      font-size: 2rem;
      border-radius: 50%;
    }
  }
}

.comment-child {
  width: 85%;
  float: right;
  margin-top: 1.5rem;
}

.nick-name {
  opacity: 0.8;
}

.header-main {
  float: left;
  margin-left: 0.5rem;
  line-height: 1.5rem;
  width: calc(100% - 3rem);
}

.human-bottom {
  color: #8590a6;
  font-size: 0.8rem;
  padding-bottom: 1rem;
}

.reply {
  float: right;
  background-color: rgba(200, 200, 200, 0.2);
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 0.8rem;
  padding: 0.1rem 0.5rem;
  cursor: pointer;
  user-select: none;

  &:hover {
    border-color: #2c3e50;
  }
}
.comment-item-reply
  color #8590a6
  margin 0 .25rem
@media (max-width: 400px) {
}
</style>
var feedbackOnGithub = {};
feedbackOnGithub.init = function(config){
    if($("feedback")){
        $.ajax({
            url: "https://feedback-on-github.possumlabs.com/src/feedback.html"
        }).then(function(data) {
            $("feedback").html(data);

            //configure me
            var user = config.username;
            var repo = config.repo;

            //change at your own risk
            var project = user+"/"+repo;
            var githubProjectUrl = "https://github.com/" + project;
            var issuesNew = "/issues/new?";

            var pathname = "Reference Path:" + window.parent.location.pathname

            //for debugging but alos for manual control
            if(config.path){
                pathname = "Reference Path:" + config.path
            }

            function pageQueuryBuilder() {
                return "title=&amp;body=%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20Details%0A%0A%E2%9A%A0%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20" +
                    project + "%20%E2%9E%9F%20GitHub%20issue%20linking.*%0A%0A*%20Path%3A%20" + pathname
            }

            function projectQueuryBuilder() {
                return "title=&amp;body=%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20Details%0A%0A%E2%9A%A0%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20" +
                    project + "%20%E2%9E%9F%20GitHub%20issue%20linking.*%0A%0A*%20Source%3A%20" + pathname
            }

            var dataModel = {
                projectFeedbackUrl: githubProjectUrl + issuesNew + projectQueuryBuilder(),
                pageFeedbackUrl:githubProjectUrl + issuesNew + pageQueuryBuilder(),
                githubFeedbackUrl:githubProjectUrl + "/issues/new/choose",
                openCount: 0,
                closedCount:0,
                viewOpen: true,
                viewClosed: false,
                openIssues:[],
                closedIssues:[]
            };

            $.ajax({
                url: "https://api.github.com/search/issues?"+
                "q=%22"+"Path%3A%20" + pathname +
                "%22%20type%3Aissue%20in%3Abody%20repo%3A"+user+"%2F"+repo+
                "&sort=created&order=desc"
            }).then(function(data) {
                data.items.forEach(element => {
                    element.commentItems=[];
                    element.expand = false;
                    element.body_nice = element.body.substring(0,element.body.indexOf("--"));
                    element.created_at_local = new Date(element.created_at).toLocaleDateString();
                    if(element.state === "closed"){
                        dataModel.closedCount++;
                        dataModel.closedIssues.push(element);
                    }
                    if(element.state === "open"){
                        dataModel.openCount++;
                        dataModel.openIssues.push(element);
                    }
                });
            });

            Vue.component('comment-view',{
                props: ['comment'], 
                template: `
                <div class="comment">
                    <h4 class="comment-title">
						<span>
                            <a class="comment-author" v-bind:href="comment.user.html_url" target="_blank">
                                {{comment.user.login}}
                            </a> 
                            commented 
                		    <a class="comment-date" v-bind:href="comment.html_url" target="_blank">
                			    <time v-bind:datetime="comment.created_at">on {{comment.created_at_local}}</time>
                		    </a>
                		</span>
            		</h4>
                    <div class="comment-body">
                        {{comment.body}} 
                    </div>
                </div>`
                });

            Vue.component('issue-view',{
                props: ['issue'], 
                template: `
                <div class="issue">
                    <button v-on:click="$emit('toggle-comments', issue)" 
                        aria-label="expand / collapse comments">
                        <div v-show="issue.expand">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                xmlns:xlink="http://www.w3.org/1999/xlink" 
                                aria-hidden="true" 
                                focusable="false" 
                                width="1em" 
                                height="1em" 
                                preserveAspectRatio="xMidYMid meet" 
                                viewBox="6 6 12 12" 
                                data-icon="ic-baseline-arrow-drop-down" 
                                data-inline="false" 
                                class="iconify" 
                                style="transform: rotate(360deg);">
                                <path d="M7 10l5 5l5-5z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <div v-show="!issue.expand">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                xmlns:xlink="http://www.w3.org/1999/xlink" 
                                aria-hidden="true" 
                                focusable="false" 
                                width="1em" 
                                height="1em" 
                                preserveAspectRatio="xMidYMid meet" 
                                viewBox="6 6 12 12" 
                                data-icon="ic-baseline-arrow-right" 
                                data-inline="false" 
                                class="iconify" 
                                style="transform: rotate(360deg);">
                                <path d="M10 17l5-5l-5-5v10z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </button>
                    <a v-bind:href="issue.html_url" target="_blank">{{issue.title}} #{{issue.number}}</a> 
                    <time v-bind:datetime="issue.created_at">created on {{issue.created_at_local}}</time>
                    by {{issue.user.login}}
                    <span class="comment-count" v-if="issue.comments > 0">
                        <span class="iconify" data-icon="ic-outline-mode-comment" data-inline="false"></span>
                        {{issue.comments}}
                    </span>
                    <div class="issue-details" v-if="issue.expand"> 
                        <div class="issue-summary">
                            {{issue.body_nice}}
                        </div>
                        <div class="issue-comments">
                            <comment-view 
                                v-for="comment in issue.commentItems" 
                                v-bind:comment="comment"></comment-view> 
                        </div>
                    </div>
                </div>`
                });

            var app = new Vue({
                el: '#feedback-app',
                data: dataModel,
                methods:{
                    viewOpenClick: function() {
                        dataModel.viewOpen = true;
                        dataModel.viewClosed = false;
                    },
                    viewClosedClick: function() {
                        dataModel.viewOpen = false;
                        dataModel.viewClosed = true;
                    },
                    expandIssueClick: function(issue) {
                        issue.expand=!issue.expand;
                        if(issue.commentItems.length < issue.comments){
                            $.ajax({
                                url: "https://api.github.com/repos/"+project+"/issues/"+issue.number+
                                "/comments?page=1&per_page=100" 
                            }).then(function(data) {
                                data.forEach(comment => {
                                    comment.created_at_local = new Date(comment.created_at).toLocaleString();
                                    issue.commentItems.push(comment);
                                });
                            });
                        }
                    }
                }
            });
        });
    }
};

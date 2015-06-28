var React = require('react');

var BadgeImg = React.createClass({
    createImg: function (badge) {
        if (badge.link) {
            return <a key={badge.url} href={badge.link}><img className="badgeImg" src={badge.url} alt={badge.titleTag} onload="this.style.opacity='1';" /></a>
        } else {
            return <img key={badge.url} className="badgeImg" src={badge.url} alt={badge.titleTag} onload="this.style.opacity='1';" />;
        }
    },
    render: function() {
        var imgContainer = undefined;
        var isGroup = this.props.badge.badges !== undefined;
        if (isGroup) {
            imgContainer = this.props.badge.badges.map(this.createImg);
        } else {
            imgContainer = this.createImg(this.props.badge);
        }
        return (
            <div className="badgeImgContainer">
            {imgContainer}
            </div>
        );
    }
});

module.exports = BadgeImg;
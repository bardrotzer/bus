/** 
 *  @fileOverview Exposes a utility function that wraps all API and internal urls in a simple getter.
 *
 *  @author       {@link http://kartoteket.as/team/bard.html}  Bård Røtzer
 *
 */

 const urls = {
   mb_contacts: () => 'https://rest.messagebird.com/contacts',
   mb_group_contacts: groupId => `https://rest.messagebird.com/groups/${groupId}/contacts`,
   mb_groups: () => 'https://rest.messagebird.com/groups',
   mb_messages: () => 'https://rest.messagebird.com/messages'
 }


 /**
 * Helper class to get Url's for all locat routes
 * {@link http://pragmatic-backbone.com/models-collections-and-data}
 * @author  {@link http://kartoteket.as/team/bard.html Bård Røtzer}
 * @param {String} type       - the type of method to get
 * @param {Mixed}  optional   - All other parameters, just passed on
 * @returns {String} the url requestd (or undefined)
 */
export default function clientUrl(type) {
  return urls[type] ? urls[type].apply(this, [].slice.call(arguments, 1)) : undefined;
}

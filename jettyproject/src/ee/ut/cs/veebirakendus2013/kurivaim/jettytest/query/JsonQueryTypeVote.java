package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryCandidateInfo;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryUserInfo;

public class JsonQueryTypeVote implements JsonQueryInterface {
	
	int voteCandidateId;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "voteAction", "Voting failed - no database connection.");
			}
			
			MysqlQueryUserInfo userInfo = queryInfo.getLoggedInUserInfo();
			JsonResponseInterface successResponse = null;
			int affectedCandidateId = voteCandidateId;
			
			if(userInfo == null) {
				return new JsonResponseTypeStatus(1, "voteAction", "Voting failed - not logged in.");
			}
			else if(userInfo.getVotedCandidateId() != 0) {
				if(voteCandidateId != 0) {
					return new JsonResponseTypeStatus(2, "voteAction", "Voting failed - already voted.");
				}
				else {
					affectedCandidateId = userInfo.getVotedCandidateId();
					
					int affected = sqlHandler.simpleUpdateQuery("UPDATE ev_users AS a JOIN ev_candidates AS b ON b.id = a.votedCandidateId SET " +
							"a.votedCandidateId = 0, b.voteCount = b.voteCount - 1 WHERE a.id = " + userInfo.getUserId());
					
					if(affected < 0) return new JsonResponseTypeStatus(-1, "voteAction", "Vote cancel failed - database query error.");
					else if(affected == 0) return new JsonResponseTypeStatus(7, "voteAction", "Vote cancel failed - no matching rows.");
					else successResponse = new JsonResponseTypeStatus(11, "voteAction", "Sucessfully cancelled vote.");
				}
			}
			else {
				if(voteCandidateId == 0) {
					return new JsonResponseTypeStatus(4, "voteAction", "Cancelling failed - your vote hasn't been used.");
				}
				else {
					int affected = sqlHandler.simpleUpdateQuery(
							"UPDATE ev_users AS a JOIN ev_candidates AS b ON b.id = " + voteCandidateId + " SET a.votedCandidateId = " + voteCandidateId + ", b.voteCount = b.voteCount + 1 " +
							"WHERE a.id = " + userInfo.getUserId() + " AND a.votedCandidateId = 0 AND b.regionId = " + userInfo.getVoteRegionId());
					
					if(affected < 0) return new JsonResponseTypeStatus(-1, "voteAction", "Voting failed - database query error.");
					else if(affected == 0) return new JsonResponseTypeStatus(6, "voteAction", "Voting failed - no such candidate in your region.");
					else successResponse = new JsonResponseTypeStatus(10, "voteAction", "Successfully voted.");
				}
			}
			
			queryInfo.doLiveBroadcast(new JsonResponseTypeCandidate(new MysqlQueryCandidateInfo(sqlHandler).querySingleByCandidateId(affectedCandidateId)));
			
			return successResponse;
		}
		catch(Exception e) {
			e.printStackTrace(); //TODO: when logging system is present, log this error
			
			return new JsonResponseTypeStatus(-1, "voteAction", "Voting failed - unknown error.");
		}
	}
}

package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.io.File;
import java.sql.SQLException;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryCandidateInfo;

public class JsonQueryTypeAdminRemoveCandidate implements JsonQueryInterface {
	
	private int userId;
	private int candidateId;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			if(!queryInfo.isLoggedInAsAdmin()) {
				return new JsonResponseTypeStatus(1, "adminRemoveCandidate", "Error - not logged in as admin.");
			}
			
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "adminRemoveCandidate", "Error - no database connection.");
			}
			
			MysqlQueryCandidateInfo candidateInfo = null;
			
			if(candidateId > 0) {
				candidateInfo = new MysqlQueryCandidateInfo(sqlHandler).querySingleByCandidateId(candidateId);
			}
			else if(userId > 0) {
				candidateInfo = new MysqlQueryCandidateInfo(sqlHandler).querySingleByUserId(userId);
			}
			
			if(candidateInfo == null) {
				return new JsonResponseTypeStatus(2, "adminRemoveCandidate", "Error - no such candidate.");
			}
			else {
				boolean querySucceeded = false;
				
				try {
					sqlHandler.getConnection().setAutoCommit(false);
					
					int resultDelete = sqlHandler.simpleUpdateQuery("DELETE FROM ev_candidates WHERE id = " + candidateInfo.getCandidateId());
					int resultUpdate = sqlHandler.simpleUpdateQuery("UPDATE ev_users SET votedCandidateId = 0 WHERE votedCandidateId = " + candidateInfo.getCandidateId());
					
					if(resultDelete < 0 || resultUpdate < 0) throw new SQLException("SQL error - already handled.");
					else if(resultDelete == 0) throw new IllegalStateException("No rows deleted.");
					
					sqlHandler.getConnection().commit();
					
					File candidatePhotoPath = new File("../html/userimg/candidate_" + candidateId + ".jpg");
					
					if(candidatePhotoPath.exists()) {
						candidatePhotoPath.delete();
					}
					
					querySucceeded = true;
				}
				catch(Exception e) {
					e.printStackTrace(); //TODO: log
					
					sqlHandler.getConnection().rollback();
				}
				finally {
					sqlHandler.getConnection().setAutoCommit(true);
				}
				
				if(querySucceeded) {
					return new JsonResponseTypeStatus(10, "adminRemoveCandidate", "Successfully removed candidate.");
				}
				else {
					return new JsonResponseTypeStatus(3, "adminRemoveCandidate", "Error - internal error.");
				}
			}
		}
		catch(Exception e) {
			e.printStackTrace(); //TODO: when logging system is present, log this error
			
			return new JsonResponseTypeStatus(-1, "adminRemoveCandidate", "Unknown error.");
		}
	}
}

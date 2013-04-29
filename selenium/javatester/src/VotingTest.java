import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;

public class VotingTest {
	private WebDriver driver;
	private String baseUrl;
	private StringBuffer verificationErrors = new StringBuffer();

	@Before
	public void setUp() throws Exception {
		driver = new FirefoxDriver();
		baseUrl = "http://maxorator.com:8080";
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	}

	@Test
	public void test() throws Exception {
		driver.get(baseUrl + "/");
		driver.findElement(By.id("menu_mydata")).click();
		
		Thread.sleep(300);
		
		driver.findElement(By.id("username")).clear();
		driver.findElement(By.id("username")).sendKeys("1022");
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("testpass");
		driver.findElement(By.cssSelector("#loginByPassword input[type=submit]")).click();
		
		Thread.sleep(300);
		
		driver.findElement(By.id("menu_voting")).click();
		
		Thread.sleep(300);
		
		int candidateCount = driver.findElements(By.cssSelector("#votingCandidateList .candidateForVoting")).size();
		
		assert(candidateCount > 0);
		
		for(int candidateIndex = 1; candidateIndex <= Math.min(4, candidateCount); candidateIndex++) {
			//equivalent for the evals used in IDE
			assertTrue(driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(" + candidateIndex + ") .action .voteGiveForm")).getCssValue("display").equals("block"));
			String voteName = driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(" + candidateIndex + ") .candidateName")).getText();
			int voteCount = Integer.parseInt(driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(" + candidateIndex + ") .voteCount")).getText());
			
			driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(" + candidateIndex + ") .action .voteGiveForm input[type=submit]")).click();
			driver.findElement(By.id("confirmBoxYes")).click();
			
			Thread.sleep(300);
			
			//equivalent for the evals used in IDE
			assertTrue(driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(1) .action .voteGiveForm")).getCssValue("display").equals("none"));
			assertTrue(driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(1) .action .voteCancelForm")).getCssValue("display").equals("block"));
			assertTrue(voteName.equals(driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(1) .candidateName")).getText()));
			assertTrue(new Integer(voteCount+1).toString().equals(driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(1) .voteCount")).getText()));
			
			driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(1) div.action form.voteCancelForm input[type=submit]")).click();
			driver.findElement(By.id("confirmBoxYes")).click();
			
			Thread.sleep(300);
			
			//equivalent for the evals used in IDE
			assertTrue(driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(1) .action .voteGiveForm")).getCssValue("display").equals("block"));
			assertTrue(driver.findElement(By.cssSelector("#votingCandidateList .candidateForVoting:nth-of-type(1) .action .voteCancelForm")).getCssValue("display").equals("none"));
			
			Thread.sleep(300);
		}
	}

	@After
	public void tearDown() throws Exception {
		driver.quit();
		String verificationErrorString = verificationErrors.toString();
		if (!"".equals(verificationErrorString)) {
			fail(verificationErrorString);
		}
	}
}

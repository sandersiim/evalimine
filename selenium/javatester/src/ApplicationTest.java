import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class ApplicationTest {
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
	public void testApplication() throws Exception {
		driver.get(baseUrl + "/");
		driver.findElement(By.id("menu_mydata")).click();

		Thread.sleep(300);
		
		driver.findElement(By.id("username")).clear();
		driver.findElement(By.id("username")).sendKeys("1022");
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("testpass");
		driver.findElement(By.cssSelector("#loginByPassword input[type=submit]")).click();
		
		Thread.sleep(300);
		
		driver.findElement(By.id("menu_mydata")).click();
		
		Thread.sleep(300);
		
		//equivalent for the eval used in IDE
		assert(driver.findElement(By.cssSelector(".myDataInfo .myDataInfoNameAndValue:last-of-type a")).getText().equals("Kandideeri oma piirkonnas"));
		
		driver.findElement(By.cssSelector(".myDataInfo .myDataInfoNameAndValue:last-of-type a")).click();
		driver.findElement(By.cssSelector("#applicationFirstName")).clear();
		driver.findElement(By.cssSelector("#applicationFirstName")).sendKeys("Toomas");
		driver.findElement(By.cssSelector("#applicationLastName")).clear();
		driver.findElement(By.cssSelector("#applicationLastName")).sendKeys("Palk");
		new Select(driver.findElement(By.cssSelector("#applicationForm .dropbox select"))).selectByIndex(1);
		driver.findElement(By.cssSelector("#applyButton")).click();
		
		Thread.sleep(300);
		
		driver.findElement(By.id("confirmBoxYes")).click();
		
		Thread.sleep(300);
		
		//equivalent for the element not present check, which seemed to hang when done with isElementPresent
		assert(driver.findElements(By.cssSelector(".myDataInfo .myDataInfoNameAndValue:last-of-type a")).size() == 0);
		
		//equivalent for the eval used in IDE
		assert(driver.findElement(By.id("myDataName")).getText().equals("Toomas Palk"));
		
		driver.findElement(By.id("menu_voting")).click();
		
		Thread.sleep(300);
		
		//equivalent for the eval used in IDE
		assert(driver.findElement(By.id("votingCandidateList")).getText().indexOf("Toomas Palk") != -1);
		
		driver.get(baseUrl + "/querytest/");
		driver.findElement(By.id("testerQueryMethod")).clear();
		driver.findElement(By.id("testerQueryMethod")).sendKeys("POST");
		driver.findElement(By.id("testerQueryType")).clear();
		driver.findElement(By.id("testerQueryType")).sendKeys("adminlogin");
		driver.findElement(By.id("testerQueryContents")).clear();
		driver.findElement(By.id("testerQueryContents")).sendKeys("{adminUsername:\"mainadmin\", adminPassword:\"testpass\"}");
		driver.findElement(By.cssSelector("#testerForm input[type=submit]")).click();
		
		Thread.sleep(300);
		
		driver.findElement(By.id("testerQueryType")).clear();
		driver.findElement(By.id("testerQueryType")).sendKeys("adminremovecandidate");
		driver.findElement(By.id("testerQueryContents")).clear();
		driver.findElement(By.id("testerQueryContents")).sendKeys("{userId:1022, candidateId:0}");
		driver.findElement(By.cssSelector("#testerForm input[type=submit]")).click();

		Thread.sleep(300);
		
		driver.get(baseUrl + "/");
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
